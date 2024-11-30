// src/controllers/pagosController.js
const Pago = require('../models/pagoModel');  // Importamos el modelo

// Función para registrar un pago consolidado
const registrarPagoConsolidado = async (req, res) => {
  const { memberId, date, services, totalAmount } = req.body;

  try {
    // Crear una nueva instancia del pago consolidado
    const nuevoPago = new Pago({
      memberId,
      date,
      services,
      totalAmount
    });

    // Guardar el pago consolidado en la base de datos
    const pagoGuardado = await nuevoPago.save();

    // Responder con éxito
    res.status(201).json({ success: true, message: 'Pago consolidado registrado con éxito.', pago: pagoGuardado });
  } catch (error) {
    console.error('Error al registrar el pago consolidado:', error.message);
    res.status(500).json({ success: false, message: 'Error al registrar el pago consolidado.' });
  }
};

// Función para obtener los pagos de un socio por su ID
const obtenerPagosSocio = async (req, res) => {
  const { memberId } = req.params;  
  try {
    const pagos = await Pago.find({ memberId });
    if (pagos.length === 0) {
      return res.status(404).json({ success: false, message: 'No se encontraron pagos para este socio.' });
    }
    // Retornar los pagos encontrados
    return res.status(200).json({
      success: true,
      message: 'Pagos encontrados.',
      data: pagos,
    });
  } catch (error) {
    console.error('Error al obtener los pagos:', error.message);
    return res.status(500).json({ success: false, message: 'Error al obtener los pagos del socio.' });
  }
};

// Función para obtener los pagos de un socio por su ID
const obtenerPagos = async (req, res) => {
  try {
    const pagos = await Pago.find();
    if (pagos.length === 0) {
      return res.status(404).json({ success: false, message: 'No se encontraron pagos para este socio.' });
    }
    // Retornar los pagos encontrados
    return res.status(200).json({
      success: true,
      message: 'Pagos encontrados.',
      data: pagos,
    });
  } catch (error) {
    console.error('Error al obtener los pagos:', error.message);
    return res.status(500).json({ success: false, message: 'Error al obtener los pagos del socio.' });
  }
};

/**
 * Función para obtener un pago específico por memberId y pagoId
 * @param {Object} req - La solicitud HTTP
 * @param {Object} res - La respuesta HTTP
 */
const obtenerPagoPorId = async (req, res) => {
  const { memberId, pagoId } = req.params; // Obtener el memberId y pagoId de los parámetros

  try {
    const pago = await Pago.findOne({ 
      memberId: memberId, 
      _id: pagoId 
    });

    // Verificar si el pago fue encontrado
    if (!pago) {
      return res.status(404).json({ error: 'Pago no encontrado.' });
    }

    // Si el pago es encontrado, devolverlo
    res.status(200).json(pago);
  } catch (error) {
    console.error('Error al obtener el pago:', error);
    res.status(500).json({ error: 'Error al obtener el pago.' });
  }
};


module.exports = { registrarPagoConsolidado,obtenerPagosSocio,obtenerPagos,obtenerPagoPorId };
