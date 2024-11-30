const amqplib = require("amqplib");
const Socio = require("../models/socioModel"); // Modelo de socios en la base de datos

/**
 * Conecta a RabbitMQ y consume mensajes de validación de socios.
 */
const startValidateMemberConsumer = async () => {
  try {
    // Conexión a RabbitMQ
    const connection = await amqplib.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();

    const queue = "validate_member"; // Cola para validar socios
    await channel.assertQueue(queue, { durable: true }); // Asegura que la cola exista
    console.log(`Escuchando mensajes en la cola '${queue}'...`);

    // Consumir mensajes de la cola
    channel.consume(
      queue,
      async (msg) => {
        try {
          if (!msg) return;

          const content = JSON.parse(msg.content.toString());
          const { memberId } = content;

          console.log(`Validando socio con ID: ${memberId}`);

          // Verificar si el socio existe en la base de datos
          const exists = await socioModel.getSocioById(memberId);

          const response = { exists: !!exists }; // Retorna true si el socio existe

          // Responder al servicio intermediario
          const replyQueue = msg.properties.replyTo;
          const correlationId = msg.properties.correlationId;

          console.log(`Enviando respuesta: ${JSON.stringify(response)} a la cola '${replyQueue}'`);

          channel.sendToQueue(
            replyQueue,
            Buffer.from(JSON.stringify(response)),
            {
              correlationId,
            }
          );

          // Confirmar que el mensaje fue procesado
          channel.ack(msg);
        } catch (error) {
          console.error("Error al procesar el mensaje en la cola 'validate_member':", error.message);
          channel.nack(msg, false, false); // Rechaza el mensaje para evitar reintentos
        }
      },
      { noAck: false } // Requiere confirmación manual del procesamiento
    );
  } catch (error) {
    console.error("Error en el consumidor validate_member:", error.message);
  }
};

module.exports = { startValidateMemberConsumer };

