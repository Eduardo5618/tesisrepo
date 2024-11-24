const Payment = require("../models/payment.model");

const createPayment = async (paymentData) => {
  try {
    console.log("Intentando guardar en la base de datos con:", paymentData);

    if (!paymentData.memberId || !paymentData.amount) {
      throw new Error("Datos incompletos: `memberId` y `amount` son obligatorios.");
    }

    const payment = new Payment(paymentData);
    await payment.save();
    console.log("Pago guardado correctamente en la base de datos:", payment);

    return payment;
  } catch (error) {
    console.error("Error al guardar el pago en la base de datos:", error.message);
    throw error;
  }
};

module.exports = { createPayment };

