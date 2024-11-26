const PDFDocument = require('pdfkit');
const fs = require('fs');

exports.generate = async (data) => {
  const pdfPath = `./reports/${Date.now()}-report.pdf`;
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(pdfPath));

  // Agregar contenido al PDF
  doc.fontSize(16).text('Reporte', { align: 'center' });
  doc.text(`Tipo: ${data.type}`, { align: 'left' });
  doc.text(`Rango de fechas: ${data.dateRange}`, { align: 'left' });

  // Finalizar
  doc.end();
  return pdfPath;
};
