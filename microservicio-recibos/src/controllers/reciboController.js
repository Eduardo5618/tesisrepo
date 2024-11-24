const Recibo = require('../models/Recibo');

// Emitir un recibo
exports.emitirRecibo = async (req, res) => {
    try {
        const nuevoRecibo = new Recibo(req.body);
        await nuevoRecibo.save();
        res.status(201).json(nuevoRecibo);
    } catch (err) {
        res.status(500).json({ error: 'Error al emitir el recibo', message: err.message });
    }
};

// Obtener un recibo por ID
exports.obtenerRecibo = async (req, res) => {
    try {
        const recibo = await Recibo.findById(req.params.id);
        if (!recibo) return res.status(404).json({ error: 'Recibo no encontrado' });
        res.json(recibo);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener el recibo', message: err.message });
    }
};

// Listar todos los recibos
exports.listarRecibos = async (req, res) => {
    try {
        const recibos = await Recibo.find();
        res.json(recibos);
    } catch (err) {
        res.status(500).json({ error: 'Error al listar recibos', message: err.message });
    }
};
