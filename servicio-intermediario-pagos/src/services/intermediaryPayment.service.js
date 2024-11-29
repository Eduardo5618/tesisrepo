const axios = require("../config/axios.config");
const { determinarEstadoPeriodo } = require("../utils/periodUtils");

/**
 * Lógica principal del servicio intermediario.
 * @param {string} operation - Tipo de operación solicitada.
 * @param {Object} data - Datos proporcionados para la operación.
 * @returns {Object} - Respuesta del microservicio correspondiente.
 */
const handlePaymentOperation = async (operation, data) => {
  try {
    // Redirigir al Microservicio de Pagos Actuales
    if (operation === "registrarPago") {
      const { memberId, date, services } = data;
      if (!memberId || !services || !Array.isArray(services)) {
        throw new Error("Debe proporcionar 'memberId' y una lista válida de 'services'.");
      }
        // Calcular estadoPeriodo para cada servicio
        const serviciosConEstado = services.map((service) => 
          {
            const estadoPeriodo = determinarEstadoPeriodo(service.periodo);
            return { ...service, estadoPeriodo };
        });
        // Dividir los servicios por estadoPeriodo
        const atrasados = serviciosConEstado.filter((service) => service.estadoPeriodo === "atrasado");
        const actualesYFuturos = serviciosConEstado.filter(
            (service) => service.estadoPeriodo === "actual" || service.estadoPeriodo === "futuro"
        );
        let updatedPendings = [];
              if (atrasados.length > 0) {
              // Validar servicios atrasados con el Microservicio de Pagos Pendientes
              console.log("Validando servicios atrasados:", atrasados);

                const response = await axios.post(
                  `${process.env.MICROSERVICIO_PAGOS_PENDIENTES_URL}/api/pagos-pendientes/validar-multiples`,
                  { memberId, services: atrasados }
                );

                if (response.data.success) {
                  updatedPendings = response.data.updatedServices;
                } else {
                  throw new Error("Error al validar servicios atrasados.");
                }
              }

            try {
              const responseActuales = await axios.post(
                `${process.env.MICROSERVICIO_PAGOS_ACTUALES_URL}/api/pagos`,
                {
                  memberId,
                  date,
                  services: actualesYFuturos,
                }
              );
              console.log("Respuesta de Pagos Actuales:", responseActuales.data);
            } catch (error) {
              console.error("Error al enviar datos a Pagos Actuales:", error.message);
              console.error("Detalles:", error.response?.data || "Sin detalles adicionales.");
              throw error;
            }

          return {
                  message: "Pago registrado correctamente.",
                  pagosPendientesValidados: updatedPendings,
                  pagoActual: pagoActual.payment,
          };
    } 
      else if (operation === "consultarPagosPendientes") {
      // Redirigir al Microservicio de Pagos Pendientes
      const response = await axios.get(`${process.env.MICROSERVICIO_PAGOS_PENDIENTES_URL}/api/pagos-pendientes?socio=${data.memberId}`);
      return response.data;
    } 
      else if (operation === "generarPagosMasivos") {
      // Redirigir al Microservicio de Pagos Pendientes
      const response = await axios.post(`${process.env.MICROSERVICIO_PAGOS_PENDIENTES_URL}/api/pagos-pendientes/masivos`, data);
      return response.data;
    } 
      else if (operation === "registrarPagoManual") {
      // Redirigir al Microservicio de Pagos Pendientes
      const response = await axios.post(`${process.env.MICROSERVICIO_PAGOS_PENDIENTES_URL}/api/pagos-pendientes/manual`, data);
      return response.data;
    } else {
      throw new Error("Operación no soportada.");
    }
  } catch (error) {
    console.error(`Error en la operación '${operation}':`, error.message);
    throw new Error(error.message);
  }
};

module.exports = { handlePaymentOperation };
