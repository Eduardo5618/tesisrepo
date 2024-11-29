const express = require("express");
const app = express();
app.use(express.json());

// Endpoint para validar pagos pendientes
app.post("/api/pagos-pendientes/validar-multiples", (req, res) => {
  console.log("Solicitud recibida en Microservicio de Pagos Pendientes:", req.body);
  const updatedServices = req.body.services.map((service) => ({
    name: service.name,
    amount: service.amount,
    periodo: service.periodo,
  }));

  res.status(200).json({
    success: true,
    updatedServices,
  });
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Microservicio de Pagos Pendientes corriendo en http://localhost:${PORT}`);
});
