const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'custom'], // Asegúrate de incluir 'monthly' aquí
        required: true,
    },
    dateRange: {
        start: { type: Date, required: true },
        end: { type: Date, required: true },
    },
    filePath: {
        type: String,
        required: false, // Cambiar a false para que no sea obligatorio al inicio
    },
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending',
    },
});

module.exports = mongoose.model('Report', ReportSchema);
