//Dependencias
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userModel = require('../models/user');

const app = express();

app.post('/login', (req, res) => {
    let body = req.body;

    if (!body.email) {
        return res.status(400).json({
            ok: false,
            error: {
                message: 'Por favor ingrese un email válido'
            }
        });
    };

    if (!body.password) {
        return res.status(400).json({
            ok: false,
            error: {
                message: 'El password es obligatorio'
            }
        });
    };

    userModel.findOne({ email: body.email }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            });
        };

        if (userDB === null) {
            return res.status(404).json({
                ok: false,
                error: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
        };

        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(404).json({
                ok: false,
                error: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            });
        };

        let token = jwt.sign({
            user: userDB
        }, process.env.SEED, { expiresIn: process.env.DURATION_TOKEN });

        res.json({
            ok: true,
            user: userDB,
            token
        });

    });

});

module.exports = app;