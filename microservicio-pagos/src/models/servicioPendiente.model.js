const mongoose = require("mongoose");

const servicioPendienteSchema = new mongoose.Schema({
    memberId: { type: String, required: true },// ID del socio
    servicio: { type: String, required: true },       // Nombre del servicio
    monto: { type: Number, required: true },          // Monto del servicio
    fechaVencimiento: { type: Date, required: true }, // Fecha límite de pago
    estado: { type: String, enum: ["pendiente", "pagado"], default: "pendiente" },
    periodo: { type: String, required: true }         // Periodo del servicio, ej. "nov-24"
});

module.exports = mongoose.model("ServicioPendiente", servicioPendienteSchema);