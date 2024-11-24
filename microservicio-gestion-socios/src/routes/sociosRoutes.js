const express = require('express');
const {
    getSocios,
    getSocio,
    createSocio,
    updateSocio,
    deleteSocio,
} = require('../controllers/sociosController');

const router = express.Router();

router.get('/', getSocios); // Obtener todos los socios
router.get('/:id', getSocio); // Obtener un socio por ID
router.post('/', createSocio); // Crear un nuevo socio
router.put('/:id', updateSocio); // Actualizar un socio
router.delete('/:id', deleteSocio); // Eliminar un socio

module.exports = router;
