const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const jwtConfig = require("../config/jwtConfig");

const users = [
  { id: 1, username: "admin", password: bcrypt.hashSync("admin123", 8) },
  { id: 2, username: "user", password: bcrypt.hashSync("user123", 8) },
];

// Genera un token JWT
exports.generateToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username }, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });
};

// Verifica la validez del token
exports.verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, jwtConfig.secret, (err, decoded) => {
      if (err) reject(err);
      resolve(decoded);
    });
  });
};

// Verifica las credenciales de un usuario
exports.authenticateUser = (username, password) => {
  const user = users.find((u) => u.username === username);
  if (!user) return null;

  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) return null;

  return user;
};
