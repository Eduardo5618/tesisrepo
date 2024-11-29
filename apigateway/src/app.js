const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const proxyRoutes = require("./routes/proxyRoutes");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use("/auth", authRoutes);
app.use("/api", proxyRoutes);

module.exports = app;
