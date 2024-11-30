// src/routes/pagosRoutes.js
const express = require('express');
const { registrarPagoConsolidado,obtenerPagosSocio,obtenerPagos,obtenerPagoPorId} = require('../controllers/pagosController');

const router = express.Router();

// Ruta para registrar un pago consolidado
router.post('/registrar', registrarPagoConsolidado);
//LISTAR PAGOS EN GENERAL
router.get('/', obtenerPagos);
//PAGO POR SOCIOS
router.get('/:memberId', obtenerPagosSocio);
//PAGOS POR SOCIOS Y PAGOIOD
router.get('/:memberId/:pagoId', obtenerPagoPorId);

module.exports = router;
