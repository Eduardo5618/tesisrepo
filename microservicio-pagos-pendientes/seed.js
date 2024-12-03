require('dotenv').config(); // Carga las variables de entorno desde .env
const mongoose = require('mongoose');
const PagoPendiente = require('./src/models/PagoPendiente'); // Asegúrate de que esta ruta es correcta

// URL de conexión a MongoDB desde el archivo .env
const mongoURL = process.env.MONGO_URI;

// Conexión a la base de datos
mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch((err) => console.error('Error al conectar a MongoDB:', err));

// Datos a insertar
const pagosPendientes = [
  {
    memberId: "1004",
    servicio: "Servicio vigilancia y limpieza",
    monto: 37,
    fechaVencimiento: new Date("2024-10-31T00:00:00Z"),
    estado: "pendiente",
    periodo: "Oct-24"
  },
  {
    memberId: "1004",
    servicio: "Cuotas administrativas",
    monto: 12,
    fechaVencimiento: new Date("2024-10-31T00:00:00Z"),
    estado: "pendiente",
    periodo: "Oct-24"
  },
  {
    memberId: "1004",
    servicio: "Servicio de Luz",
    monto: 44,
    fechaVencimiento: new Date("2024-10-31T00:00:00Z"),
    estado: "pendiente",
    periodo: "Oct-24"
  },
  {
    memberId: "1004",
    servicio: "Desratización o fumigación",
    monto: 7,
    fechaVencimiento: new Date("2024-09-30T00:00:00Z"),
    estado: "pendiente",
    periodo: "Set-24"
  },
];

// Insertar datos
const seedDatabase = async () => {
  try {
    await PagoPendiente.insertMany(pagosPendientes);
    console.log('Datos insertados correctamente');
    mongoose.connection.close(); // Cierra la conexión
  } catch (error) {
    console.error('Error al insertar datos:', error);
    mongoose.connection.close(); // Cierra la conexión
  }
};

// Ejecuta la función para insertar los datos
seedDatabase();
