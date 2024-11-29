const express = require("express");
const { processPaymentRequest } = require("../controllers/payment.controller");
const { authenticateToken } = require("../middlewares/auth.middleware");

const router = express.Router();

// Ruta protegida para manejar solicitudes de pago
router.post("/", authenticateToken, processPaymentRequest);

module.exports = router;
