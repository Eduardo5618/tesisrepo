module.exports = {
    secret: process.env.JWT_SECRET || "tesis01", // Define la clave secreta
    expiresIn: "1h", // Tiempo de expiración de los tokens
  };
  