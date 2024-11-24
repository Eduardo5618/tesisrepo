require('dotenv').config({ path: '../.env' }); 
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { consumePaymentMessages } = require("./consumers/payments.consumer");
const sociosRoutes = require('./routes/sociosRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use('/api/socios', sociosRoutes);

consumePaymentMessages();

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Servidor de Gestión de Socios corriendo en http://localhost:${PORT}`);
});
