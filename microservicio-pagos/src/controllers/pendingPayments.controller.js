const {
    generarPagosPendientesMasivos,
    registrarPagoPendienteManual,
  } = require("../services/pendingPayments.service");
  
  /**
   * Controlador para generar pagos pendientes masivos.
   */
  const generarPendientesMasivos = async (req, res) => {
    try {
      const { serviciosGenericos, socios } = req.body;
  
      if (!Array.isArray(serviciosGenericos) || !Array.isArray(socios)) {
        return res.status(400).json({
          error: "Los campos 'serviciosGenericos' y 'socios' deben ser arreglos.",
        });
      }
  
      const resultado = await generarPagosPendientesMasivos(serviciosGenericos, socios);
  
      res.status(201).json(resultado);
    } catch (error) {
      console.error("Error al generar pagos pendientes masivos:", error.message);
      res.status(500).json({
        error: "Error al generar pagos pendientes masivos.",
        details: error.message,
      });
    }
  };
  
  const registrarPendiente = async (req, res) => {
    try {
      const nuevoPendiente = req.body;
  
      const resultado = await registrarPagoPendienteManual(nuevoPendiente);
  
      res.status(201).json(resultado);
    } catch (error) {
      console.error("Error al registrar pago pendiente:", error.message);
      res.status(500).json({
        error: "Error al registrar pago pendiente.",
        details: error.message,
      });
    }
  };
  
  module.exports = { generarPendientesMasivos, registrarPendiente };
  