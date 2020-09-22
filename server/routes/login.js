//Dependencias
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

//Configuración del google sign-In
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
};

app.post('/google', async(req, res) => {
    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(err => {
            return res.status(403).json({
                ok: false,
                err
            });
        });

    userModel.findOne({ email: googleUser.email }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: err
            });
        }

        if (userDB) {

            if (userDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'Debe iniciar sesión con un nombre de usuario y contraseña'
                    }
                });
            } else {
                let token = jwt.sign({
                    user: userDB
                }, process.env.SEED, { expiresIn: process.env.DURATION_TOKEN });

                return res.json({
                    ok: true,
                    user: userDB,
                    token_id: token
                });
            };
        } else {
            //Si no existe el usuario se crea (Otra forma de utilizar el modelo)

            let user = new userModel();

            user.name = googleUser.name;
            user.email = googleUser.email;
            user.password = '.....';
            user.img = googleUser.img;
            user.google = googleUser.google;

            user.save((err, userSaved) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        message: err
                    });
                };

                let token = jwt.sign({
                    user: userSaved
                }, process.env.SEED, { expiresIn: process.env.DURATION_TOKEN });

                return res.json({
                    ok: true,
                    user: userSaved,
                    token
                });

            });

        };
    });


});

module.exports = app;