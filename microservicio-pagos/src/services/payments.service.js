const Payment = require("../models/payment.model");
const ServicioPendiente = require("../models/servicioPendiente.model");

/**
 * Determina el estado del período del servicio.
 * @param {string} periodo - Periodo en formato "Mes-Año" (e.g., "Nov-24").
 * @returns {string} - "actual", "futuro", o "atrasado".
 */
const determinarEstadoPeriodo = (periodo) => {
  const hoy = new Date();
  const mesActual = hoy.getMonth() + 1; // Mes actual (1-12)
  const anioActual = hoy.getFullYear();

  const [mesStr, anioStr] = periodo.split("-");
  const meses = {Ene: 1,Feb: 2,Mar: 3,Abr: 4,May: 5,Jun: 6,Jul: 7,Ago: 8,Sep: 9,Oct: 10,Nov: 11,Dic: 12,
  };
  const mesServicio = meses[mesStr];
  const anioServicio = parseInt(anioStr, 10) + (anioStr.length === 2 ? 2000 : 0);

  console.log(anioServicio, "-",mesServicio)

  if (anioServicio > anioActual || (anioServicio === anioActual && mesServicio > mesActual)) {
    return "futuro";
  }
  if (anioServicio === anioActual && mesServicio === mesActual) {
    return "actual";
  }
  return "atrasado";
};

/**
 * Procesa servicios atrasados: busca en pendientes y aplica mora si corresponde.
 * @param {Object} service - Información del servicio.
 * @param {string} memberId - ID del miembro.
 * @param {boolean} moraAplicada - Indica si ya se aplicó la mora.
 * @returns {Object} - Detalles del servicio procesado.
 */

const procesarServicioAtrasado = async (service, memberId, moraAplicada) => {
  const { name, amount, periodo } = service;

  const servicioPendiente = await ServicioPendiente.findOne({
    memberId,
    servicio: name,
    periodo,
    estado: "pendiente",
  });

  if (!servicioPendiente) {
    throw new Error(`El servicio '${name}' para el periodo '${periodo}' no está pendiente o no existe.`);
  }

  if (servicioPendiente.monto !== amount) {
    throw new Error(
      `El monto enviado (${amount}) para el servicio '${name}' no coincide con el monto pendiente (${servicioPendiente.monto}).`
    );
  }

  const moraServices = [];

  if (!moraAplicada) {
    moraServices.push({
      name: "Mora",
      amount: 10,
      periodo,
      razon: "Se aplicó porque uno o más servicios están vencidos.",
    });
  }

  // Marcar el servicio como pagado
  servicioPendiente.estado = "pagado";
  await servicioPendiente.save();

  return { moraServices, serviceProcessed: { name, amount, periodo } };
};

/**
 * Procesa múltiples servicios de pago.
 * @param {string} memberId - ID del miembro.
 * @param {string} date - Fecha del pago.
 * @param {Array} services - Lista de servicios.
 * @returns {Object} - Resumen del pago procesado.
 */
const processMultipleServicesPayment = async (memberId, date, services) => {
  try {
    const servicesArray = [];
    let totalAmount = 0;
    let moraAplicada = false;

    for (const service of services) {
      const { name, amount, periodo } = service;

      if (!name || !amount || !periodo) {
        throw new Error("Cada servicio debe incluir 'name', 'amount' y 'periodo'.");
      }

      // Determinar el estado del período del servicio
      const estadoPeriodo = determinarEstadoPeriodo(periodo);

      if (estadoPeriodo === "futuro") {
        console.log(`Servicio '${name}' del periodo '${periodo}' es futuro y no requiere validación.`);
        servicesArray.push({ name, amount, periodo });
        totalAmount += amount;
        continue;
      }

      if (estadoPeriodo === "actual") {
        console.log(`Servicio '${name}' del periodo '${periodo}' es actual y no requiere validación.`);
        servicesArray.push({ name, amount, periodo });
        totalAmount += amount;
        continue;
      }

      if (estadoPeriodo === "atrasado") {
        const { moraServices, serviceProcessed } = await procesarServicioAtrasado(service, memberId, moraAplicada);
        servicesArray.push(serviceProcessed);

        if (moraServices.length > 0) {
          moraAplicada = true; // Marcar que la mora ya se aplicó
          servicesArray.push(...moraServices);
          totalAmount += moraServices.reduce((sum, mora) => sum + mora.amount, 0);
        }

        totalAmount += serviceProcessed.amount;
      }
    }

    const newPayment = new Payment({
      memberId,
      services: servicesArray,
      totalAmount,
      date,
    });

    await newPayment.save();

    return {
      message: "Pago registrado correctamente.",
      payment: newPayment,
    };
  } catch (error) {
    console.error("Error al procesar el pago:", error.message);
    throw error;
  }
};

module.exports = { processMultipleServicesPayment };
