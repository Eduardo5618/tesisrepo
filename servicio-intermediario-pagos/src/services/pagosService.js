const axios = require('axios');

/**
 * @param {string} memberId - ID del socio a validar.
 * @returns {Promise<boolean>} - Devuelve true si el socio existe, false si no.
 */

const validateMember = async (memberId) => {
  try {
    const response = await axios.get(`http://localhost:3002/api/socios/${memberId}`);
    
    if (response.status === 200 && response.data) {
      console.log(`Socio con ID ${memberId} existe.`);
      return true; 
    } else {
      console.error(`Socio con ID ${memberId} no encontrado.`);
      return false;
    }
  } catch (error) {
    console.error(`Error al consultar el socio con ID ${memberId}:`, error.message);
    return false; 
  }
};

const determinarEstadoPeriodo = (periodo) => {
  const hoy = new Date();
  const mesActual = hoy.getMonth() + 1; 
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

  if (anioServicio > anioActual || (anioServicio === anioActual && mesServicio > mesActual)) {
    return "futuro";
  }

  if (anioServicio === anioActual && mesServicio === mesActual) {
    return "actual";
  }

  return "atrasado";
};

module.exports = { validateMember, determinarEstadoPeriodo };
