const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conectado a MongoDB en Pagos Actuales");
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error.message);
    process.exit(1); // Detiene el servidor si no puede conectarse
  }
};

module.exports = connectDB;
