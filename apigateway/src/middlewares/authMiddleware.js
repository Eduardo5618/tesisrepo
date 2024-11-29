const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwtConfig");

exports.verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(403).send({ message: "Token no proporcionado" });

  jwt.verify(token, jwtConfig.secret, (err, decoded) => {
    if (err) return res.status(401).send({ message: "Token inválido" });
    req.userId = decoded.id; // Guarda el ID del usuario en la solicitud
    next();
  });
};
