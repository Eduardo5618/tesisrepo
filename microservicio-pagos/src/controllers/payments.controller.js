const { publishPayment } = require("../config/rabbitmq.service");

const registerPayment = async (req, res) => {
  try {
    console.log("Datos recibidos en la solicitud:", req.body);
    const paymentData = req.body;

    // Publicar en la cola de pagos completados
    await publishPayment("payment_completed", paymentData);

    res.status(202).json({
      message: "Pago enviado para validación.",
      payment: paymentData,
    });
  } catch (error) {
    console.error("Error al procesar el pago:", error.message);
    res.status(500).json({ error: "Error al procesar el pago." });
  }
};

module.exports = { registerPayment };
