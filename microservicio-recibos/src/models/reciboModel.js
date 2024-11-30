const mongoose = require('mongoose');

const reciboSchema = new mongoose.Schema({
  memberId: { type: String, required: true },
  amount: { type: Number, required: true },
  services: [
    {
      name: { type: String, required: true },
      monto: { type: Number, required: true },
      periodo: { type: String, required: true },
    }
  ],
  filePath: { type: String, required: true },
  fileName: { type: String, required: true },
  date: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Recibo', reciboSchema);

