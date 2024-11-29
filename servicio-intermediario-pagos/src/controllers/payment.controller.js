const { handlePaymentOperation } = require("../services/intermediaryPayment.service");

/**
 * Controlador genérico para manejar operaciones relacionadas con pagos.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 */
const processPaymentRequest = async (req, res) => {
  try {
    const { operation, data } = req.body;

    if (!operation || !data) {
      return res.status(400).json({
        error: "La solicitud debe incluir 'operation' y 'data'.",
      });
    }

    // Llama al servicio de lógica principal
    const result = await handlePaymentOperation(operation, data);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error al procesar la solicitud:", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { processPaymentRequest };
