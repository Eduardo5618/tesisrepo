const express = require('express');
const bodyParser = require('body-parser');
const recibosRoutes = require('./routes/recibosRoutes');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

const app = express();
app.use(bodyParser.json());

app.use('/api/recibos', recibosRoutes);

module.exports = app;