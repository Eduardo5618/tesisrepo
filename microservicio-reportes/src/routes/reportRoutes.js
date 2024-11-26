const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const reportController = require('../controllers/reportController');

// Middleware de validación
const validateGenerateReport = [
    check('type').isString().notEmpty().withMessage('Type is required'),
    check('filters.dateRange')
        .isString()
        .notEmpty()
        .withMessage('Date range is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

// Define las rutas
router.post('/generate', reportController.generateReport);
router.get('/download/:id', reportController.downloadReport);
router.get('/', reportController.getAllReports);
router.get('/:id', reportController.getReportById);
router.delete('/:id', reportController.deleteReport);

module.exports = router;
