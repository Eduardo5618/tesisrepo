const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const jwtConfig = require("../config/jwtConfig");

const users = [
  { id: 1, username: "admin", password: bcrypt.hashSync("admin123", 8) },
];

exports.login = (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  const token = jwt.sign({ id: user.id }, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });

  res.json({ token });
};

exports.verify = (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(403).send({ message: "Token no proporcionado" });

  jwt.verify(token, jwtConfig.secret, (err, decoded) => {
    if (err) return res.status(401).send({ message: "Token inválido" });
    res.status(200).send({ userId: decoded.id });
  });
};

const authService = require("../services/authService");

exports.login = (req, res) => {
  const { username, password } = req.body;

  const user = authService.authenticateUser(username, password);
  if (!user) return res.status(401).json({ message: "Credenciales inválidas" });

  const token = authService.generateToken(user);
  res.json({ token });
};
