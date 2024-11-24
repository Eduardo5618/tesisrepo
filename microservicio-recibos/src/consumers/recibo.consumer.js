const { getChannel } = require('../config/rabbitmq.service');
const { generarRecibo } = require('../services/recibo.service');

const consumePayments = async () => {
    try {
        const channel = getChannel();
        const queue = 'payment_completed';

        await channel.assertQueue(queue);
        console.log(`Esperando mensajes en la cola '${queue}'...`);

        channel.consume(queue, async (msg) => {
            if (msg !== null) {
                const paymentData = JSON.parse(msg.content.toString());
                console.log('Evento recibido en payment_completed:', paymentData);

                try {
                    // Generar recibo a partir del pago recibido
                    await generarRecibo(paymentData);

                    // Confirmar el mensaje como procesado
                    channel.ack(msg);
                } catch (error) {
                    console.error('Error al procesar el mensaje:', error.message);
                    // No confirmes el mensaje para reintentos automáticos
                }
            }
        });
    } catch (error) {
        console.error('Error al consumir eventos de la cola payment_completed:', error.message);
    }
};

module.exports = { consumePayments };
