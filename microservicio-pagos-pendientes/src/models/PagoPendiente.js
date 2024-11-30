// src/models/PagoPendiente.js
const mongoose = require('mongoose');

const PagoPendienteSchema = new mongoose.Schema({
  memberId: { type: String, required: true },
  servicio: { type: String, required: true },
  monto: { type: Number, required: true },
  fechaVencimiento: { type: Date, required: true },
  estado: { type: String, enum: ['pendiente', 'validado'], default: 'pendiente' },
  periodo: { type: String, required: true },
});

const PagoPendiente = mongoose.model('ServicioPendiente', PagoPendienteSchema);

module.exports = PagoPendiente;