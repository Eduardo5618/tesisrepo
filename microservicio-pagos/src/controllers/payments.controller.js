const { processMultipleServicesPayment } = require("../services/payments.service");
const { publishPayment } = require("../config/rabbitmq.service");

const registerPayment = async (req, res) => {
    try {

      console.log("Datos recibidos en la solicitud:", req.body);
      const { memberId, date, services, Total } = req.body;
      console.log("Servicios después de la desestructuración:", services);

        // Validar que 'services' sea un arreglo
      if (!Array.isArray(services)) {
          console.error("Tipo de 'services':", typeof services);
          console.error("Contenido de 'services':", services);
          return res.status(400).json({
            error: "'services' debe ser un arreglo.",
            details: `Tipo recibido: ${typeof services}. Contenido recibido: ${JSON.stringify(services)}`
          });
        }

        if (!memberId || !services || !Array.isArray(services)) {
            return res.status(400).json({ error: "Faltan campos obligatorios: 'memberId' y 'services'." });
        }

        // Procesar el pago
        const { payment, mora } = await processMultipleServicesPayment(memberId, date, services);

        // Publicar el pago procesado en RabbitMQ
        await publishPayment("payment_completed", { payment, mora });

        res.status(201).json({
            message: "Pago registrado correctamente.",
            payment,
            mora
        });
    } catch (error) {
        console.error("Error al procesar el pago:", error.message);
        res.status(500).json({ error: "Error al procesar el pago.", details: error.message });
    }
};

module.exports = { registerPayment };