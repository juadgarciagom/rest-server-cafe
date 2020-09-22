require('./config/config');

//Dependencias

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

const app = express();

//Middlewares (Filtro para ejercer un control de seguridad, se usan regularmente con la palabra reservada use)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Habilitación de las rutas en public
app.use(express.static(path.resolve(__dirname, '../public')));

//console.log(path.resolve(__dirname, '../public'));


//Middlewares de las rutas
app.use(require('./routes/index'));

//Utilización de mongoose para conectar con la base de datos

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useUnifiedTopology: true }, (err, resp) => {
    if (err) throw err;
    console.log('Data base connected!!', process.env.URLDB);
});

//Inicialización del servidor
app.listen(process.env.PORT, () => {
    console.log('Servidor montado en el puerto', process.env.PORT);
});