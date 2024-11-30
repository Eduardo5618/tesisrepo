// src/routes/pagosRoutes.js
const express = require('express');
const { registrarPagoConsolidado } = require('../controllers/pagosController');

const router = express.Router();

// Ruta para registrar un pago consolidado
router.post('/registrar', registrarPagoConsolidado);

module.exports = router;
