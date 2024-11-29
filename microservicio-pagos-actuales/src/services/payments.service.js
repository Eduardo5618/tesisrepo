const Payment = require("../models/payment.model");

/**
 * @param {string} memberId - ID del miembro.
 * @param {string} date - Fecha del pago.
 * @param {Array} services - Lista de servicios.
 * @returns {Object} - Resumen del pago registrado.
 */

const processPayments  = async (memberId, date, services) => {
  
  try {
      const processedServices = [];
      let totalAmount = 0;

        // Procesar servicios actuales y futuros
        for (const service of services) {
          const { name, amount, periodo, estadoPeriodo } = service;

          if (estadoPeriodo === "actual" || estadoPeriodo === "futuro") {
            console.log('Entrando al push',memberId, date, services)
              processedServices.push({ name, amount, periodo });
              totalAmount += amount;
          } else {
            throw new Error(
              `El servicio '${name}' con período '${periodo}' no es válido para pagos actuales o futuros.`
            );
          }
        }


        console.log('ARRAY DE PS',processedServices)
        // Crear y guardar el pago en la base de datos
        const newPayment = new Payment({
          memberId,
          services: processedServices,
          totalAmount,
          date,
        });

      await newPayment.save();

      return {
        message: "Pago registrado correctamente.",
        payment: newPayment,
      };
      
  } catch (error) {
    console.error("Error al procesar los pagos:", error.message);
    throw error;
  }
};


module.exports = { processPayments };
