const amqplib = require("amqplib");
const { updateSocioPaymentStatus } = require("../models/socioModel");

let channel;

const connectToRabbitMQ = async () => {
  if (!channel) {
    const connection = await amqplib.connect(process.env.RABBITMQ_URL || "amqp://localhost");
    channel = await connection.createChannel();
  }
  return channel;
};

// Publicar mensajes en una cola específica
const publishToQueue = async (queue, message) => {
  try {
    const channel = await connectToRabbitMQ();
    await channel.assertQueue(queue); // Asegura que la cola existe
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    console.log(`Mensaje enviado a la cola '${queue}':`, message);
  } catch (error) {
    console.error(`Error al publicar mensaje en la cola '${queue}':`, error.message);
  }
};

// Consumir mensajes de la cola `payment_completed`
const consumePaymentMessages = async () => {
  try {
    const channel = await connectToRabbitMQ();
    const queue = "payment_completed";

    await channel.assertQueue(queue);
    console.log(`Esperando mensajes en la cola '${queue}'...`);

    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const content = JSON.parse(msg.content.toString());
        console.log("Mensaje recibido:", content);

        try {
          // Validar y actualizar el socio
          const updatedSocio = await updateSocioPaymentStatus(content.memberId, content.amount);

          if (!updatedSocio) {
            console.error(`Socio con ID ${content.memberId} no encontrado. Moviendo a cola de errores.`);
            await publishToQueue("payment_errors", {
              ...content,
              error: `Socio con ID ${content.memberId} no encontrado.`,
            });
          } else {
            console.log(`Estado del socio ${content.memberId} actualizado con éxito.`);
            // Publicar en la cola de pagos confirmados
            await publishToQueue("payment_confirmed", content);
          }
        } catch (error) {
          console.error("Error procesando el mensaje:", error.message);
        }

        // Confirmar que el mensaje fue procesado
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error("Error al consumir mensajes:", error.message);
  }
};

module.exports = { consumePaymentMessages };
