require('dotenv').config();  // Asegúrate de que dotenv esté cargado
const app = require("./src/app");

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Microservicio de socios corriendo en http://localhost:${PORT}`);
});
