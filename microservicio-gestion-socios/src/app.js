require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { startValidateMemberConsumer } = require("./consumers/validateMember.consumer");
const sociosRoutes = require('./routes/sociosRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use('/api/socios', sociosRoutes);

//startValidateMemberConsumer();

module.exports = app;
