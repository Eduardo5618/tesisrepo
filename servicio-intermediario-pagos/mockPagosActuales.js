const express = require("express");
const app = express();
app.use(express.json());

// Endpoint para registrar pagos actuales y futuros
app.post("/api/pagos", (req, res) => {
  console.log("Solicitud recibida en Microservicio de Pagos Actuales:", req.body);
  res.status(200).json({
    message: "Pago registrado correctamente en Pagos Actuales.",
    payment: req.body,
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Microservicio de Pagos Actuales corriendo en http://localhost:${PORT}`);
});
