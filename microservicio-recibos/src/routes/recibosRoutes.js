const express = require('express');
const { generarRecibo,obtenerRecibosPorMemberId,generarReciboPorPagoId } = require('../controllers/reciboController');
const router = express.Router();

// Ruta para generar el recibo de pago
router.post('/generar', generarRecibo);
// Ruta para obtener un recibo usando el memberId
router.get('/:memberId', obtenerRecibosPorMemberId);
// NUEVO: Ruta para generar un recibo por el ID del socio y el ID del pago
router.get('/generar/:memberId/:pagoId', generarReciboPorPagoId);

module.exports = router;
