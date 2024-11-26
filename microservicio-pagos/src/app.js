const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const mongoose = require("mongoose");
const { connectRabbitMQ } = require("./config/rabbitmq.service");


const paymentRoutes = require("./routes/payments.routes");
const { consumeValidatedPayments, consumeErrorPayments } = require("./consumers/payments.consumer");

const pendingPaymentsRoutes = require("./routes/pendingPayments.routes"); // Nuevas rutas


const app = express();
app.use(bodyParser.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch((err) => console.error("Error de conexión a MongoDB:", err));

// Conectar a RabbitMQ y consumir colas
connectRabbitMQ()
  .then(() => {
    consumeValidatedPayments(); 
    consumeErrorPayments();
  })
  .catch((err) => console.error("Error al conectar a RabbitMQ:", err));

// Rutas de pagos
app.use("/api/pagos", paymentRoutes);
app.use("/api/pagos-pendientes", pendingPaymentsRoutes);

module.exports = app;

