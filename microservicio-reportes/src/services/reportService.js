const Report = require('../models/reportModel');
const pdfGenerator = require('../utils/pdfGenerator');

exports.generateReport = async (params) => {
    const { type, dateRange } = params;

    // Crear el reporte en la base de datos
    const report = new Report({
        type,
        dateRange,
        status: 'pending',
    });
    // Guardar el reporte inicial
    await report.save();
    // Generar el archivo PDF (esto puede tardar un momento)
    const pdfPath = await pdfGenerator.generate(params);
    // Actualizar el reporte con la ruta del archivo generado
    report.status = 'completed';
    report.filePath = pdfPath;
    await report.save();
    return report;
};

exports.getReportFile = async (id) => {
  const report = await Report.findById(id);
  if (!report || !report.filePath) throw new Error('Report not found');
  return report.filePath;
};
