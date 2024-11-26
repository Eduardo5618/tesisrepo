const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const morgan = require('morgan'); // Para logs
const connectDB = require('./config/db');
const reportRoutes = require('./routes/reportRoutes');

// Cargar variables de entorno
dotenv.config();

const app = express();

// Conectar a la base de datos
connectDB();

// Middlewares
app.use(morgan('dev')); // Logs de solicitudes HTTP
app.use(bodyParser.json()); // Procesar JSON en solicitudes

// Rutas
app.use('/api/reports', reportRoutes);

// Ruta base para verificar que el servidor está funcionando
app.get('/', (req, res) => {
    res.send('Report Service is running');
});

// Manejo de rutas no encontradas
app.use((req, res, next) => {
    res.status(404).json({ error: 'Route not found' });
});

// Middleware global para manejo de errores
app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    res.status(500).json({
        message: 'An unexpected error occurred',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error',
    });
});

// Exportar app
module.exports = app;
