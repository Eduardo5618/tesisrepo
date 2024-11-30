const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Función para generar el recibo en formato PDF
 * @param {Object} pago - Objeto con la información del pago.
 * @param {String} memberId - ID del socio.
 * @param {String} pagoId - ID del pago.
 * @returns {String} - Ruta del archivo PDF generado.
 */
const generarReciboPDF = (pago, memberId, pagoId) => {
  return new Promise((resolve, reject) => {
    try {
      // Crear un nuevo documento PDF
      const doc = new PDFDocument();
      const date = new Date().toISOString().split('T')[0]; // Fecha actual
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

      // Resolve con la ruta del archivo PDF generado
      resolve(filePath);
    } catch (error) {
      reject(error); // Si ocurre un error, lo rechazamos
    }
  });
};

module.exports = { generarReciboPDF };
