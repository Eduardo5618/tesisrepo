const amqplib = require("amqplib");

let channel;

const connectRabbitMQ = async () => {
  try {
    if (!process.env.RABBITMQ_URL) {
      throw new Error("RABBITMQ_URL no está definido en el archivo de configuración.");
    }

    const connection = await amqplib.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    console.log("RabbitMQ conectado");
  } catch (error) {
    console.error("Error al conectar a RabbitMQ:", error.message);
    throw error;
  }
};

const publishPayment = async (queue, message) => {
  try {
    if (!channel) {
      throw new Error("Canal de RabbitMQ no inicializado. Asegúrate de conectar primero.");
    }

    await channel.assertQueue(queue);
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    console.log(`Mensaje publicado en la cola '${queue}':`, message);

  } catch (error) {
    console.error(`Error al publicar mensaje en la cola '${queue}':`, error.message);
    throw error;
  }
};

const getChannel = () => {
  if (!channel) {
    throw new Error("Canal de RabbitMQ no inicializado. Llama a 'connectRabbitMQ' primero.");
  }
  return channel;
};

module.exports = { connectRabbitMQ, publishPayment, getChannel };