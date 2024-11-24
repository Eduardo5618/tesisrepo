const express = require('express');
const { emitirRecibo, obtenerRecibo, listarRecibos } = require('../controllers/reciboController');
const router = express.Router();

// Rutas para recibos
router.post('/recibos', emitirRecibo);
router.get('/recibos/:id', obtenerRecibo);
router.get('/recibos', listarRecibos);

module.exports = router;
