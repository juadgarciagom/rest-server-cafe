require('./config/config');

//Dependencias

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

const app = express();

//Middlewares (Filtro para ejercer un control de seguridad, se usan regularmente con la palabra reservada use)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Middlewares de las rutas
app.use(require('./routes/index'));

//Utilización de mongoose para conectar con la base de datos
mongoose.connect('mongodb://localhost:27017/cafe', { useNewUrlParser: true, useUnifiedTopology: true }, (err, resp) => {
    if (err) throw err;
    console.log('Data base connected!!');
});

//Inicialización del servidor
app.listen(3000, () => {
    console.log('Servidor montado en el puerto', process.env.PORT);
});