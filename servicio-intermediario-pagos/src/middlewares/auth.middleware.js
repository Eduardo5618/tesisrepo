const jwt = require("jsonwebtoken");

/**
 * Middleware para validar el token JWT.
 * @param {Object} req - Solicitud HTTP.
 * @param {Object} res - Respuesta HTTP.
 * @param {Function} next - Callback para continuar con la siguiente función.
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token no proporcionado." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token inválido." });
    }

    req.user = user; // Agrega los datos del usuario a la solicitud
    next();
  });
};

module.exports = { authenticateToken };

