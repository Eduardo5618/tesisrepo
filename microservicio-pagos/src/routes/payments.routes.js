const express = require("express");
const { registerPayment  } = require("../controllers/payments.controller");

const router = express.Router();

router.post("/", registerPayment);

module.exports = router;
