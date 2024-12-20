const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    memberId: {type: String,required: [true, "El campo `memberId` es obligatorio"]},
    date: {type: Date,required: true},
    services: [
        {
            name: { type: String, required: true },    
            monto: { type: Number, required: true }, // Monto del servicio
            periodo: { type: String, required: true }, // Periodo del servicio
            estadoPeriodo: {type: String,required: true} //ESTADO (ATRASADO,FUTURO,ACTUAL)
        }
    ],
    totalAmount: {
        type: Number, 
        required: [true, "El campo `totalAmount` es obligatorio"]
    },
});

module.exports = mongoose.model("Payment", paymentSchema);


