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

module.exports = { registrarPagoConsolidado };
