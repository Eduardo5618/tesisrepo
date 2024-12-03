// server.js
const connectDB = require('./src/config/db');
const app = require('./src/app');

connectDB();
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Microservicio de Pagos Pendientes corriendo en ${PORT}`);
});