const { createProxyMiddleware } = require("http-proxy-middleware");

const createProxy = (target) =>
    createProxyMiddleware({
      target,
      changeOrigin: true,
      onProxyReq: (proxyReq, req, res) => {
        console.log(`[Proxy] ${req.method} ${req.url} -> ${target}${req.url}`);
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log(`[Response] ${proxyRes.statusCode} from ${target}`);
      },
      onError: (err, req, res) => {
        console.error("Error en el proxy:", err.message);
        res.status(500).send("Error al conectar con el microservicio");
      },
    });

module.exports = {
  sociosProxy: createProxy("http://localhost:3002"), // Microservicio de gestión de socios
  pagosProxy: createProxy("http://localhost:3001"),  // Microservicio de pagos
  recibosProxy: createProxy("http://localhost:3003"), // Microservicio de recibos
  reportesProxy: createProxy("http://localhost:3004"), // Microservicio de reportes
};


  