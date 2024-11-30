const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const Recibo = require('../models/reciboModel');
const { generarReciboPDF } = require('../utils/generarRecibo'); // Importar la función para generar el recibo en PDF


// Generar recibo en PDF y guardarlo
const generarRecibo = async (req, res) => {
    try {
      const { memberId, date, services, totalAmount } = req.body;
  
      if (!memberId || !date || !services || !totalAmount) {
        return res.status(400).json({ success: false, message: 'Datos incompletos para generar el recibo.' });
      }
  
      // Crear un nuevo documento PDF
      const doc = new PDFDocument();
      const fileName = `Recibo_${memberId}_${date}.pdf`;
      const filePath = path.join(__dirname, `../recibos/${fileName}`);
      
      // Crear el flujo de escritura para guardar el archivo
        doc.pipe(fs.createWriteStream(filePath));
        
        doc.fontSize(18).text('Recibo de Pago', { align: 'center' });
        doc.moveDown();
    
        // Información del pago
        doc.fontSize(12).text(`Socio: ${memberId}`);
        doc.text(`Pago ID: ${pagoId}`);
        doc.text(`Fecha del Pago: ${pago.date}`);
        doc.text(`Total Pagado: $${pago.totalAmount}`);
        doc.text(`Servicios:`);
        
        pago.services.forEach(service => {
            doc.text(`- ${service.name} (${service.periodo}): $${service.monto}`);
        });
    
        doc.moveDown();
        doc.text('Gracias por tu pago!', { align: 'center' });
    
        doc.end(); // Finaliza el archivo PDF
  
      // Enviar el recibo generado como respuesta
        res.status(200).json({
            success: true,
            message: 'Recibo generado correctamente.',
            fileName,
            filePath,
        });
  
    } catch (error) {
      console.error('Error al generar el recibo:', error.message);
      res.status(500).json({ success: false, message: 'Error al generar el recibo.' });
    }
  };
  

const obtenerRecibosPorMemberId = async (req, res) => {
  const { memberId } = req.params;
  try {
    const recibo = await Recibo.findOne({ memberId });
    if (!recibo) {
      return res.status(404).json({ success: false, message: 'Recibo no encontrado.' });
    }
    res.status(200).json({ success: true, recibo });
  } catch (error) {
    console.error('Error al obtener el recibo:', error);
    res.status(500).json({ success: false, message: 'Error al obtener el recibo.' });
  }
};

const generarReciboPorPagoId = async (req, res) => {
    const { memberId, pagoId } = req.params; // Obtener los parámetros de la solicitud
  
    try {
      // Consultar el pago en el microservicio de pagos actuales usando el memberId y pagoId
      const responsePago = await axios.get(`http://localhost:3004/api/pagos/${memberId}/${pagoId}`);
      
      if (!responsePago.data) {
        return res.status(404).json({ error: 'Pago no encontrado' });
      }
  
      const pago = responsePago.data;
  
      // Llamar a la función que genera el recibo en PDF
      const filePath = await generarReciboPDF(pago, memberId, pagoId);
  
      // Enviar la URL del archivo generado
      res.status(200).json({
        success: true,
        message: 'Recibo generado correctamente.',
        fileUrl: `http://localhost:3005/recibos/${path.basename(filePath)}`,
      });
    } catch (error) {
      console.error('Error al generar el recibo:', error);
      res.status(500).json({ error: 'Error al generar el recibo' });
    }
  };



module.exports = { generarRecibo, obtenerRecibosPorMemberId,generarReciboPorPagoId };
