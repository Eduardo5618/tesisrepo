require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const paymentRoutes = require("./routes/pagosRoutes");

const app = express();
app.use(bodyParser.json());

// Rutas
app.use("/api/intermediario-pagos", paymentRoutes);

module.exports = app;
