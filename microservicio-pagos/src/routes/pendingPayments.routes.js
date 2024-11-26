const express = require("express");
const { generarPendientesMasivos, registrarPendiente } = require("../controllers/pendingPayments.controller");

const router = express.Router();

// Ruta para generar pagos pendientes masivos
router.post("/masivos", generarPendientesMasivos);

// Ruta para registrar un pago pendiente manual
router.post("/manual", registrarPendiente);

module.exports = router;
