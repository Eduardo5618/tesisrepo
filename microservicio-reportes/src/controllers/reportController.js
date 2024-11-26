const reportService = require('../services/reportService');
const path = require('path');
const fs = require('fs');
const Report = require('../models/reportModel');

exports.generateReport = async (req, res) => {
  try {
    const reportData = await reportService.generateReport(req.body);
    res.status(201).json({ success: true, data: reportData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.downloadReport = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report || !report.filePath) {
            return res.status(404).json({ success: false, message: 'Reporte no encontrado' });
        }

        // Verifica que el archivo exista en el sistema de archivos
        const filePath = path.resolve(report.filePath);
        res.download(filePath, (err) => {
            if (err) {
                console.error('Error al descargar el archivo:', err);
                return res.status(500).json({ success: false, message: 'Error al descargar el archivo' });
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllReports = async (req, res) => {
    try {
        const reports = await Report.find(); // Obtiene todos los reportes de la base de datos
        res.status(200).json({ success: true, data: reports });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getReportById = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id); // Busca el reporte por ID en la base de datos
        if (!report) {
            return res.status(404).json({ success: false, message: 'Reporte no encontrado' });
        }
        res.status(200).json({ success: true, data: report });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteReport = async (req, res) => {
    try {
        // Buscar el reporte por ID
        const report = await Report.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ success: false, message: 'Reporte no encontrado' });
        }

        // Opcional: Eliminar el archivo físico asociado al reporte
        if (report.filePath) {
            const filePath = path.resolve(report.filePath);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath); // Eliminar el archivo
            } else {
                console.warn('Archivo no encontrado en el sistema de archivos:', filePath);
            }
        }

        // Eliminar el registro del reporte de la base de datos
        await Report.findByIdAndDelete(req.params.id);

        res.status(200).json({ success: true, message: 'Reporte eliminado' });
    } catch (error) {
        console.error('Error al eliminar el reporte:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

