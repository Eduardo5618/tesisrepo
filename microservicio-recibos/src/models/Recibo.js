const mongoose = require('mongoose');

const ReciboSchema = new mongoose.Schema({
    transaccionId: { type: String, required: true },
    socioId: { type: String, required: true },
    tipoPago: { type: String, enum: ['Fijo', 'Esporádico', 'Externo'], required: true },
    montoTotal: { type: Number, required: true },
    detalles: [{ descripcion: String, monto: Number }],
    fechaEmision: { type: Date, default: Date.now },
    estado: { type: String, enum: ['Emitido', 'Cancelado'], default: 'Emitido' },
    urlRecibo: { type: String },
});

module.exports = mongoose.model('Recibo', ReciboSchema);
