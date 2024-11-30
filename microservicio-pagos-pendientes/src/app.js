// src/app.js
const express = require('express');
const bodyParser = require('body-parser');
const pagosRoutes = require('./routes/pagosRoutes');
require('dotenv').config(); // Cargar variables de entorno

const app = express();
app.use(bodyParser.json());

// Rutas
app.use('/api/pagos-pendientes', pagosRoutes); // Configuramos las rutas

module.exports = app;

