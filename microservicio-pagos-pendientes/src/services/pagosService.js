/**
 * Función para validar si el pago está vencido.
 * @param {Object} service - Objeto del servicio con detalles como el nombre, monto y periodo.
 * @returns {boolean} - Si el servicio está vencido o no.
 */
const validarPago = async (service) => {
    const { periodo } = service;
    const fechaActual = new Date();
    const fechaPeriodo = new Date(periodo); // Convertimos el periodo a una fecha real (Ej. "Oct-24")
  
    // Comparamos si la fecha actual es mayor que el periodo, es decir, si está vencido
    if (fechaActual > fechaPeriodo) {
      return true; // Pago vencido
    } else {
      return false; // Pago no vencido
    }
  };
  
  module.exports = { validarPago };
  