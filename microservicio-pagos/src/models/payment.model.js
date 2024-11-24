const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  memberId: {
    type: String,
    required: [true, "El campo `memberId` es obligatorio"],
  },
  amount: {
    type: Number,
    required: [true, "El campo `amount` es obligatorio"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Payment", paymentSchema);
