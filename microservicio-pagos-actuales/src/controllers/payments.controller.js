const { processPayments } = require("../services/payments.service");
//const { publishPayment } = require("../config/rabbitmq.service");

/**
 * Controlador para registrar pagos actuales o futuros.
 * @param {Object} req - Solicitud HTTP.
 * @param {Object} res - Respuesta HTTP.
 */


const registerPayment = async (req, res) => {

  console.log("Solicitud recibida en el controlador de pagos:", req.body);

    try {
      const { memberId, date, services } = req.body;
        // Validar que 'services' sea un arreglo
        if (!memberId || !services || !Array.isArray(services)) {
          return res.status(400).json({
            error: "Debe proporcionar 'memberId' y una lista válida de 'services'.",
          });
        }
    
        const result = await processPayments(memberId, date, services);
        res.status(200).json(result);
      } catch (error) {
        console.error("Error al registrar el pago:", error.message);
        res.status(500).json({ error: error.message });
      }
};

module.exports = { registerPayment };