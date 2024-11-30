// src/routes/pagosRoutes.js

const express = require('express');
const { registrarPago,obtenerPagosSocio } = require('../controllers/pagosController'); // Asegúrate de importar correctamente

const router = express.Router();

// Ruta para registrar el pago
router.post('/', registrarPago);  // Aquí se usa la función importada
router.get('/obtenerpagos/:memberId', obtenerPagosSocio); 

module.exports = router;
