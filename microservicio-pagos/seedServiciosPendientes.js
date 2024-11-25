require("dotenv").config();
const mongoose = require("mongoose");
const ServicioPendiente = require("./src/models/servicioPendiente.model");

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Conectado a MongoDB"))
    .catch((err) => console.error("Error al conectar a MongoDB:", err));

// Datos iniciales para la colección
const serviciosPendientes = [
    {
        memberId: "2",
        servicio: "Agua",
        monto: 30,
        fechaVencimiento: new Date("2024-11-20"),
        estado: "pendiente",
        periodo: "Ene-24"
    }
];

// Función para cargar los datos
const seedDatabase = async () => {
    try {
        await ServicioPendiente.deleteMany(); // Limpiar la colección (opcional)
        await ServicioPendiente.insertMany(serviciosPendientes); // Insertar los datos iniciales
        console.log("Datos iniciales insertados correctamente.");
        mongoose.connection.close(); // Cerrar la conexión
    } catch (error) {
        console.error("Error al insertar datos:", error);
    }
};

seedDatabase();
