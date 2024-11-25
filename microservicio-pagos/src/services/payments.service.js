const Payment = require("../models/payment.model");
const ServicioPendiente = require("../models/servicioPendiente.model");

const processMultipleServicesPayment = async (memberId, date, services) => {
  try {
    const servicesArray = [];
    let totalAmount = 0; 
    let moraAplicada = false;
    const hoy = new Date();
    const mesActual = hoy.getMonth() + 1; 
    const anioActual = hoy.getFullYear();

    for (const service of services) {
      const { name, amount, periodo } = service;

      if (!name || !amount || !periodo ) {
        throw new Error("Cada servicio debe incluir 'name', 'amount' y 'periodo'.");
      }
      const [mesStr, anioStr] = periodo.split("-");
      const mesServicio = new Date(`${mesStr} 1, ${anioStr}`).getMonth() + 1; 
      const anioServicio = parseInt(anioStr, 10) + (anioStr.length === 2 ? 2000 : 0);

      if (anioServicio === anioActual && mesServicio === mesActual) {
        console.log(`Servicio '${name}' del periodo '${periodo}' es actual y no requiere validación.`);
      } else if (anioServicio < anioActual || (anioServicio === anioActual && mesServicio < mesActual)) {
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

        if (!moraAplicada) {
          moraAplicada = true;
          const moraService = {
            name: "Mora",
            amount: 10,
            periodo: `${mesStr}-${anioStr}`,
            razon: "Se aplicó porque uno o más servicios están vencidos.",
          };
          servicesArray.push(moraService);
          totalAmount += moraService.amount;
        }

        servicioPendiente.estado = "pagado";
        await servicioPendiente.save();
      }

      servicesArray.push({ name, amount, periodo });
      totalAmount += amount;
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