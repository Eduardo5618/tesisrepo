const ServicioPendiente = require("../models/servicioPendiente.model");

const generarPagosPendientesMasivos = async (serviciosGenericos, socios) => {
  try {
    const pendientes = [];

    for (const socio of socios) {
      for (const servicio of serviciosGenericos) {
        const { servicio: nombreServicio, monto, periodo } = servicio;

        const nuevoPendiente = new ServicioPendiente({
          memberId: socio.memberId,
          servicio: nombreServicio,
          monto,
          fechaVencimiento: new Date(periodo.vencimiento),
          estado: "pendiente",
          periodo: periodo.descripcion, 
        });

        pendientes.push(nuevoPendiente);
      }
    }

    // Guardar todos los pendientes en la BD
    await ServicioPendiente.insertMany(pendientes);

    return {
      message: "Pagos pendientes generados correctamente.",
      count: pendientes.length,
    };
  } catch (error) {
    console.error("Error al generar pagos pendientes:", error.message);
    throw error;
  }
};

/**
 * Registrar pagos pendientes de manera manual.
 */
const registrarPagoPendienteManual = async (nuevoPendiente) => {
  try {
    const pendiente = new ServicioPendiente(nuevoPendiente);
    await pendiente.save();

    return {
      message: "Pago pendiente registrado correctamente.",
      pendiente,
    };
  } catch (error) {
    console.error("Error al registrar pago pendiente manual:", error.message);
    throw error;
  }
};

module.exports = {
  generarPagosPendientesMasivos,
  registrarPagoPendienteManual,
};
