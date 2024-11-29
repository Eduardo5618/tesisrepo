const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const connectDB = require("./config/db");
const { connectRabbitMQ } = require("./config/rabbitmq.service");
const paymentRoutes = require("./routes/payments.routes");



const app = express();
app.use(bodyParser.json());

// Conectar a MongoDB
connectDB();

// Conectar a RabbitMQ y consumir colas
/*connectRabbitMQ()
  .then(() => {
    consumeValidatedPayments(); 
    consumeErrorPayments();
  })
  .catch((err) => console.error("Error al conectar a RabbitMQ:", err));*/

// Rutas de pagos

app.use("/api/pagos", paymentRoutes);

module.exports = app;

