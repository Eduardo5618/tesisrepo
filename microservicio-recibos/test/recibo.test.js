const request = require('supertest');
const app = require('../server');

describe('API Recibos', () => {
    it('Debe emitir un recibo', async () => {
        const response = await request(app).post('/api/recibos').send({
            transaccionId: '12345',
            socioId: '67890',
            tipoPago: 'Fijo',
            montoTotal: 100,
            detalles: [{ descripcion: 'Luz', monto: 50 }, { descripcion: 'Agua', monto: 50 }],
        });
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('montoTotal', 100);
    });
});
