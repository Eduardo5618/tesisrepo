// src/app.js
const express = require('express');
const bodyParser = require('body-parser');
const pagosRoutes = require('./routes/pagosRoutes');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Middleware
app.use(bodyParser.json());

// Conectar a la base de datos
connectDB();

// Usar las rutas de pagos
app.use('/api/pagos', pagosRoutes);

module.exports = app;

