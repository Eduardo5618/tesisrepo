// src/routes/pagosRoutes.js
const express = require('express');
const { validarPagosPendientes, obtenerPagosPendientes } = require('../controllers/pagosController');

const router = express.Router();

router.post('/validar', validarPagosPendientes);  // Endpoint para validar los pagos pendientes
router.get('/', obtenerPagosPendientes);

module.exports = router;
