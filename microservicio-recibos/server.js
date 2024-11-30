require('dotenv').config();  // Asegúrate de que dotenv esté cargado
const app = require("./src/app");

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Servicio recibos corriendo en http://localhost:${PORT}`);
});
