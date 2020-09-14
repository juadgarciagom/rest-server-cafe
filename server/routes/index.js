//Dependencias
const express = require('express');

const app = express();

//Middlewares de las rutas
app.use(require('./user'));
app.use(require('./category'));
app.use(require('./product'));
app.use(require('./login'));

module.exports = app;