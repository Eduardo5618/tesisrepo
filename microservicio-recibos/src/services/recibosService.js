const Recibo = require('../models/reciboModel');
const PDFDocument = require('pdfkit');
const fs = require('fs');

const generarRecibo = async (paymentData) => {
    try {
        console.log('Generando recibo para el evento de pago:', paymentData);

        // Crear el recibo en la base de datos
        const recibo = new Recibo({
            transaccionId: paymentData.transaccionId,
            socioId: paymentData.memberId,
            tipoPago: paymentData.paymentType,
            montoTotal: paymentData.amount,
            detalles: paymentData.details,
            fechaEmision: new Date(),
            estado: 'Emitido',
        });

        await recibo.save();

        // Generar el PDF del recibo
        const doc = new PDFDocument();
        const filePath = `./recibos/${recibo._id}.pdf`;

        if (!fs.existsSync('./recibos')) {
            fs.mkdirSync('./recibos');
        }

        doc.pipe(fs.createWriteStream(filePath));
        doc.fontSize(20).text('Recibo de Pago', { align: 'center' });
        doc.text(`Recibo ID: ${recibo._id}`);
        doc.text(`Socio ID: ${recibo.socioId}`);
        doc.text(`Fecha: ${new Date(recibo.fechaEmision).toLocaleDateString()}`);
        doc.text(`Total: S/ ${recibo.montoTotal}`, { align: 'right' });
        doc.text('\nDetalles:', { underline: true });
        recibo.detalles.forEach((detalle) => {
            doc.text(`${detalle.descripcion}: S/ ${detalle.monto}`);
        });
        doc.end();

        console.log('Recibo generado y guardado:', recibo);

        return filePath;
    } catch (error) {
        console.error('Error al generar el recibo:', error.message);
        throw error;
    }
};

module.exports = { generarRecibo };
