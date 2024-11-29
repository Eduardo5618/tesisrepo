const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const paymentRoutes = require("./routes/payment.routes");

const app = express();
app.use(bodyParser.json());

// Rutas del servicio intermediario
app.use("/api/intermediario-pagos", paymentRoutes);

module.exports = app;
