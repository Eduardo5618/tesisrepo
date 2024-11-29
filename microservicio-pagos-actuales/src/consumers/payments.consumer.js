const { createPayment } = require("../services/payments.service");
const { getChannel } = require("../config/rabbitmq.service");

const consumeValidatedPayments = async () => {
  try {
    const channel = getChannel();
    const queue = "payment_confirmed";
    
    await channel.assertQueue(queue);
    console.log(`Esperando mensajes en la cola '${queue}'...`);

    console.log("Suscribiéndose a la cola:", queue);
    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const paymentData = JSON.parse(msg.content.toString());
        console.log("Pago validado recibido:", paymentData);

        try {
          await createPayment(paymentData); 
          console.log("Pago guardado en la base de datos:", paymentData);
        } catch (error) {
          console.error("Error al guardar el pago:", error.message);
        }
        channel.ack(msg); // Confirmar el mensaje como procesado
      }
    });
  } catch (error) {
    console.error("Error al consumir mensajes de pagos validados:", error.message);
  }
};

const consumeErrorPayments = async () => {
    try {
      const channel = getChannel();
      if (!channel) {
        console.error("Error: Canal de RabbitMQ no inicializado.");
        return;
      }
  
      const queue = "payment_errors";
      await channel.assertQueue(queue);
      console.log(`Esperando mensajes en la cola '${queue}'...`);
  
      channel.consume(queue, (msg) => {
        if (msg) {
          const paymentData = JSON.parse(msg.content.toString());
          console.error("Mensaje no válido recibido en 'payment_errors':", paymentData);
          console.error("Razón: El ID del socio es inválido o no existe en la base de datos de socios.");
  
          // Confirmar el mensaje como procesado
          channel.ack(msg);
        }
      });
    } catch (error) {
      console.error("Error al consumir mensajes de errores:", error.message);
    }
  };

module.exports = { consumeValidatedPayments, consumeErrorPayments };
