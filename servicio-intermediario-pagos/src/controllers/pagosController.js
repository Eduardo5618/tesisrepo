const { validateMember, determinarEstadoPeriodo } = require('../services/pagosService');
const axios = require('axios');

// Función para procesar la solicitud de pago
const registrarPago = async (req, res) => {
  const { memberId, date, services } = req.body.data;
  //ESTRUCTURA RECIBIDA
  console.log(req.body.data);
  try {
    //VALIDA SI EL SOCIO EXISTE
    console.log(memberId);
    console.log(`Validando el socio con ID: ${memberId}`);
    const socioValido = await validateMember(memberId);
    if (!socioValido) {
      return res.status(400).json({ error: `El socio con ID ${memberId} no existe.` });
    }

    // Clasificar los servicios por estado del periodo
    const serviciosConEstado = services.map((service) => {
      const estadoPeriodo = determinarEstadoPeriodo(service.periodo);
      return { ...service, estadoPeriodo };
    });
    const atrasados = serviciosConEstado.filter(service => service.estadoPeriodo === 'atrasado');
    const actualesYFuturos = serviciosConEstado.filter(service => service.estadoPeriodo !== 'atrasado');
    let serviciosAtrasadosValidados = [];

    // Paso 1: Si existen servicios atrasados, validarlos antes de registrar el pago
    if (atrasados.length > 0) {
      console.log('Enviando los pagos atrasados para validación...');
      try {
        const response = await axios.post('http://localhost:3003/api/pagos-pendientes/validar', { memberId, services: atrasados });
        console.log('Respuesta del microservicio de pagos pendientes:', response.data);
    
        if (response.data.success) {
          // Validar si los montos de los pagos atrasados coinciden con los registrados en la BD
          serviciosAtrasadosValidados = response.data.updatedServices.filter(service => {
            const servicioAtrasado = atrasados.find(servicio => servicio.periodo === service.periodo);
            
            if (servicioAtrasado && servicioAtrasado.monto !== service.monto) {
              console.error(`El monto para el servicio ${service.servicio} es incorrecto. Esperado: ${servicioAtrasado.monto}, pero recibido: ${service.monto}`);
              return false; 
            }
            service.estadoPeriodo = `atrasado-${service.estado}`;
            const { _id, memberId, __v, fechaVencimiento, estado, ...serviceData } = service;
            return serviceData;  // Devolvemos solo los datos necesarios
          });
    
          if (serviciosAtrasadosValidados.length !== atrasados.length) {
            return res.status(400).json({ error: 'El monto de algunos pagos atrasados no coincide con los registros en la base de datos.' });
          }
    
        } else {
          return res.status(400).json({ error: 'No se pudieron validar todos los pagos atrasados.' });
        }
      } catch (error) {
        console.error('Error al validar pagos:', error.message);
        return res.status(500).json({ error: 'Error al validar los pagos atrasados. No se puede registrar el pago.' });
      }
    }
    // Paso 4: Crear el pago consolidado, eliminando el campo `fechaVencimiento` si existe
    const pagoConsolidado = {
      memberId,
      date,
      services: [
        ...serviciosAtrasadosValidados.map(service => {
          return {
            name: service.servicio, 
            monto: service.monto,
            periodo: service.periodo,
            estadoPeriodo: service.estadoPeriodo, 
          };
        }),
        ...actualesYFuturos.map(service => {
          return {
            name: service.name, 
            monto: service.monto,
            periodo: service.periodo,
            estadoPeriodo: service.estadoPeriodo,
          };
        })
      ],
      totalAmount: [
        ...serviciosAtrasadosValidados, 
        ...actualesYFuturos,
      ].reduce((sum, service) => {
        console.log('Sumando servicio: ', service); 
        return sum + (service.monto || 0);
      }, 0),
    };

  
    console.log('Pago consolidado: ', pagoConsolidado);
    const responsePagoActuales = await axios.post('http://localhost:3004/api/pagos/registrar', pagoConsolidado);
    try{
      console.log('Se generara una nota de pago');
      const responseRecibo = await axios.post('http://localhost:3005/api/recibos/generar', {
        memberId,
        date,
        services: pagoConsolidado.services,
        totalAmount: pagoConsolidado.totalAmount
      });
      console.log('Recibo generado correctamente:', responseRecibo.data);
    }catch(error){
      console.error('Error al generar el recibo:', error.message);
    }

    console.log('Pago ingresado correctamente')
    res.status(200).json({ message: 'Pago registrado correctamente.', pago: responsePagoActuales.data });
  } catch (error) {
    console.error('Error en el servicio intermediario:', error.message);
    res.status(500).json({ error: error.message });
  }
};


const obtenerPagosSocio = async (req, res) => {
  const { memberId } = req.params;

  try {
    const response = await axios.get(`http://localhost:3004/api/pagos/${memberId}`);
    if (response.status === 200) {
      // Si se obtienen los pagos, responder con los datos
      return res.status(200).json(response.data);
    } else {
      return res.status(404).json({ message: 'No se encontraron pagos para este socio' });
    }
  } catch (error) {
    console.error('Error al obtener pagos:', error.message);
    return res.status(500).json({ error: 'Error al obtener los pagos.' });
  }
};

module.exports = { registrarPago,obtenerPagosSocio};

