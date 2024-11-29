const express = require("express"); 
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const proxyService = require("../services/proxyService");

router.use("/api/socios", authMiddleware.verifyToken, proxyService.sociosProxy);
router.use("/api/pagos", authMiddleware.verifyToken, proxyService.pagosProxy);
router.use("/api/recibos", authMiddleware.verifyToken, proxyService.recibosProxy);
router.use("/api/reportes", authMiddleware.verifyToken, proxyService.reportesProxy);

module.exports = router;
