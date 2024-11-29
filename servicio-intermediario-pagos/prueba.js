const jwt = require("jsonwebtoken");

// Clave secreta
const secret = "mi_super_secreto";

// Información del usuario que irá en el token
const payload = { id: "12345", role: "user" };

// Generar el token con 1 hora de expiración
const token = jwt.sign(payload, secret, { expiresIn: "1h" });
console.log("Token JWT:", token);
