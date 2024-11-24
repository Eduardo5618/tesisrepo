const express = require('express');
const connectDB = require('./src/config/db');
const reciboRoutes = require('./src/routes/reciboRoutes');
const { connectRabbitMQ } = require('./src/config/messaging');


const app = express();

// Middleware
app.use(express.json());

// Rutas
app.use('/api', reciboRoutes);

// Conectar a MongoDB
connectDB();

// Conectar a RabbitMQ
connectRabbitMQ()
    .then(() => {
        consumePaymentEvents();
    })
    .catch((err) => {
        console.error('Error al conectar a RabbitMQ:', err.message);
    });

// Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
