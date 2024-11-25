const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    memberId: {
        type: String,
        required: [true, "El campo `memberId` es obligatorio"]
    },
    services: [
        {
            name: { type: String, required: true },    // Nombre del servicio
            amount: { type: Number, required: true }, // Monto del servicio
            periodo: { type: String, required: true } // Periodo del servicio
        }
    ],
    totalAmount: {
        type: Number, // Total del pago sumando los servicios y la mora
        required: [true, "El campo `totalAmount` es obligatorio"]
    },
    mora: {
        name: { type: String },       // Nombre del cargo adicional ("Mora")
        amount: { type: Number },     // Monto de la mora
        razon: { type: String }       // Razón de la mora
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Payment", paymentSchema);


