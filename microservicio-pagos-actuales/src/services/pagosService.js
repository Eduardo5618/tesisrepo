// src/services/pagosService.js
const Pago = require('../models/pagoModel');

// Función para guardar el pago consolidado en la base de datos
const guardarPagoConsolidado = async (pagoConsolidado) => {
  try {
    const nuevoPago = new Pago(pagoConsolidado);
    return await nuevoPago.save();
  } catch (error) {
    console.error('Error en el servicio de pagos:', error.message);
    throw new Error('No se pudo guardar el pago consolidado.');
  }
};

module.exports = { guardarPagoConsolidado };
