const express = require('express');
const fs = require('fs');
const path = require('path');
const { checkToken } = require('../middlewares/authentication')

const app = express();

app.get('/images/:type/:img', checkToken, (req, res) => {
    let type = req.params.type;
    let img = req.params.img;

    let pathImg = path.resolve(__dirname, `../../uploads/${type}/${img}`);

    let noImg = path.resolve(__dirname, `../assets/noimage.png`);


    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        res.sendFile(noImg)
    }

});


module.exports = app;