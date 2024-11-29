/**
 * Determina el estado del período del servicio.
 * @param {string} periodo - Período en formato "Mes-Año" (e.g., "Oct-24").
 * @returns {string} - "actual", "futuro" o "atrasado".
 */
const determinarEstadoPeriodo = (periodo) => {
    const hoy = new Date();
    const mesActual = hoy.getMonth() + 1; // Mes actual (1-12)
    const anioActual = hoy.getFullYear();
  
    const [mesStr, anioStr] = periodo.split("-");
    const meses = {
        Ene: 1, Feb: 2, Mar: 3, Abr: 4, May: 5, Jun: 6,
        Jul: 7, Ago: 8, Sep: 9, Oct: 10, Nov: 11, Dic: 12,
        // Compatibilidad con meses en inglés
        Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
        Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
    };
  
    const mesServicio = meses[mesStr];
    const anioServicio = parseInt(anioStr, 10) + (anioStr.length === 2 ? 2000 : 0);

    // Período futuro
    if (anioServicio > anioActual || (anioServicio === anioActual && mesServicio > mesActual)) {
      return "futuro";
    }
  
    // Período actual
    if (anioServicio === anioActual && mesServicio === mesActual) {
      return "actual";
    }
  
    // Período atrasado
    return "atrasado";
  };
  
  module.exports = { determinarEstadoPeriodo };
  
  