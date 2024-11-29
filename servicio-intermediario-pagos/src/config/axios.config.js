const axios = require("axios");

const instance = axios.create({
  timeout: 5000, 
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Error en Axios:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

module.exports = instance;
