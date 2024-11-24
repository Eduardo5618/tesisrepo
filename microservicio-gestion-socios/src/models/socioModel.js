const pool = require('../config/db');

// Obtener todos los socios
const getAllSocios = async () => {
    const query = 'SELECT * FROM socios';
    const result = await pool.query(query);
    return result.rows;
};

// Obtener un socio por ID
const getSocioById = async (id) => {
    const query = 'SELECT * FROM socios WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

// Crear un nuevo socio
const createSocio = async (nombre, apellido, dni, domicilio, correo, asociacion, telefono, genero, edad) => {
    const query = `
        INSERT INTO socios (nombre, apellido, dni, domicilio, correo, asociacion, telefono, genero, edad)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *;
    `;
    const result = await pool.query(query, [nombre, apellido, dni, domicilio, correo, asociacion, telefono, genero, edad]);
    return result.rows[0];
};

// Actualizar un socio
const updateSocio = async (id, nombre, apellido, dni, domicilio, correo, asociacion, telefono, genero, edad) => {
    const query = `
        UPDATE socios
        SET nombre = $1, apellido = $2, dni = $3, domicilio = $4, correo = $5, 
            asociacion = $6, telefono = $7, genero = $8, edad = $9
        WHERE id = $10
        RETURNING *;
    `;
    const result = await pool.query(query, [nombre, apellido, dni, domicilio, correo, asociacion, telefono, genero, edad, id]);
    return result.rows[0];
};
// Eliminar un socio
const deleteSocio = async (id) => {
    const query = 'DELETE FROM socios WHERE id = $1 RETURNING *;';
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

const updateSocioPaymentStatus = async(id, amount) =>{
    const query = `
    UPDATE socios
    SET balance = balance - $1
    WHERE id = $2
    RETURNING *`;
  const result = await pool.query(query, [amount, id]);
  return result.rows[0];
};

module.exports = {
    getAllSocios,
    getSocioById,
    createSocio,
    updateSocio,
    deleteSocio,
    updateSocioPaymentStatus,
};
