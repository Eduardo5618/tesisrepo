const express = require("express");
const { registerPayment, registerPendingPayments } = require("../controllers/payments.controller");

const router = express.Router();

router.post("/", registerPayment);


module.exports = router;
