const socioModel = require('../models/socioModel');

// Obtener todos los socios
const getSocios = async (req, res) => {
    try {
        const socios = await socioModel.getAllSocios();
        res.status(200).json(socios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un socio por ID
const getSocio = async (req, res) => {
    const { id } = req.params;
    try {
        const socio = await socioModel.getSocioById(id);
        if (!socio) {
            return res.status(404).json({ message: 'Socio no encontrado' });
        }
        res.status(200).json(socio);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear un nuevo socio
const createSocio = async (req, res) => {
    const { nombre, apellido, dni, domicilio, correo, asociacion, telefono, genero, edad } = req.body;
    try {
        const nuevoSocio = await socioModel.createSocio(nombre, apellido, dni, domicilio, correo, asociacion, telefono, genero, edad);
        res.status(201).json(nuevoSocio);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar un socio
const updateSocio = async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, dni, domicilio, correo, asociacion, telefono, genero, edad } = req.body;
    try {
        const socioActualizado = await socioModel.updateSocio(id, nombre, apellido, dni, domicilio, correo, asociacion, telefono, genero, edad);
        if (!socioActualizado) {
            return res.status(404).json({ message: 'Socio no encontrado' });
        }
        res.status(200).json(socioActualizado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Eliminar un socio
const deleteSocio = async (req, res) => {
    const { id } = req.params;
    try {
        const socioEliminado = await socioModel.deleteSocio(id);
        if (!socioEliminado) {
            return res.status(404).json({ message: 'Socio no encontrado' });
        }
        res.status(200).json({ message: 'Socio eliminado', socio: socioEliminado });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
module.exports = {
    getSocios,
    getSocio,
    createSocio,
    updateSocio,
    deleteSocio,
};
