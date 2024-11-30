const PagoPendiente = require('../models/PagoPendiente');  // Importa el modelo

const obtenerPagosPendientes = async (req, res) => {
  try {
    const pagosPendientes = await PagoPendiente.find({ estado: 'pendiente' });
    
    if (pagosPendientes.length === 0) {
      return res.status(404).json({ success: false, message: 'No se encontraron pagos pendientes.' });
    }
    return res.json({ success: true, data: pagosPendientes });
  } catch (error) {
    console.error('Error al obtener los pagos pendientes:', error);
    return res.status(500).json({ success: false, message: 'Error al obtener los pagos pendientes.' });
  }
};


const validarPagosPendientes = async (req, res) => {
  console.log("Datos recibidos:", req.body); // Verifica qué datos recibes
  const { memberId, services } = req.body;

    // Verifica si los datos son válidos
    if (!memberId || !services || !Array.isArray(services)) {
      return res.status(400).json({ success: false, message: 'Datos inválidos o servicio no encontrado.' });
    }
  
  try {
    const periodos = services.map(service => service.periodo);
    console.log('Periodos recibidos:', periodos);
    const pagosPendientes = await PagoPendiente.find({
      memberId: memberId,
      periodo: { $in: periodos }, // Usamos $in para filtrar por los periodos recibidos
      estado: 'pendiente', // Solo buscamos pagos pendientes
    });

    console.log('Buscando pagos con estos parámetros: ', {
      memberId: memberId,
      periodo: { $in: services.map(service => service.periodo) }, 
      estado: 'pendiente',
    });

    if (!pagosPendientes || pagosPendientes.length === 0) {
      return res.status(404).json({ success: false, message: 'No se encontraron pagos pendientes.' });
    }

    console.log('Pagos pendientes encontrados:', pagosPendientes);

    if (!Array.isArray(pagosPendientes)) {
      return res.status(404).json({ success: false, message: 'No se encontraron pagos pendientes.' });
    }

    if (pagosPendientes.length === 0) {
      return res.status(404).json({ success: false, message: 'No se encontraron pagos pendientes.' });
    }

    // 2. Compara los montos
    const pagosValidos = pagosPendientes.every((pago, index) => {
        const service = services.find(s => s.periodo === pago.periodo);
        return service && service.monto === pago.monto;  // Si el monto no coincide, no validamos este pago
    });

    // Si algún pago no es válido (montos no coinciden)
    if (!pagosValidos) {
        return res.status(400).json({ success: false, message: 'Los montos de los pagos pendientes no coinciden con los registros.' });
    }
    // 3. Si todo es correcto, se actualiza el estado de los pagos a "validado"
    const updatedPayments = await Promise.all(pagosPendientes.map(async (pago) => {
      pago.estado = 'validado';  
      await pago.save();
      return pago;
    }));
    
    return res.json({ success: true, updatedServices: updatedPayments });
  } catch (error) {
    console.error('Error en la validación de pagos pendientes:', error);
    return res.status(500).json({ success: false, message: 'Error al validar los pagos pendientes.' });
  }
};


module.exports = { validarPagosPendientes ,obtenerPagosPendientes};

