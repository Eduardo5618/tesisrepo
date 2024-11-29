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
        type: Number, 
        required: [true, "El campo `totalAmount` es obligatorio"]
    },
    mora: {
        name: { type: String },       
        amount: { type: Number },    
        razon: { type: String }       
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Payment", paymentSchema);


