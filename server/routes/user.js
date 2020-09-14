//Dependencias
const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const userModel = require('../models/user');

const { checkToken, checkAdminRole } = require('../middlewares/authentication')
const app = express();


//Rutas (Endpoints)
app.get('/users', checkToken, (req, res) => {

    let since = req.query.since || 0;
    since = parseInt(since)

    let limit = req.query.limit || 5;
    limit = parseInt(limit);

    userModel.find({ status: true }, 'name email role img')
        .skip(since)
        .limit(limit)
        .exec((err, usersDB) => {
            if (err) {
                return res.status(404).json({
                    ok: false,
                    message: err
                });
            };

            userModel.countDocuments({ status: true }, (err, count) => {
                if (err) {
                    return res.status(404).json({
                        ok: false,
                        message: err
                    });
                };

                res.json({
                    ok: true,
                    users: usersDB,
                    total: count
                });
            });

        });

});

app.post('/users', [checkToken, checkAdminRole], (req, res) => {
    let body = req.body;

    let user = new userModel({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
        img: body.img,
        status: body.status,
        google: body.google
    });

    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            });
        };

        res.json({
            ok: true,
            user: userDB
        });
    });

});

//El put y el delete debe ser de un solo usuario
app.put('/users/:id', [checkToken, checkAdminRole], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'role', 'email', 'img', 'password']);

    if (body.password === null) {
        body.password = bcrypt.hashSync(body.password, 10)
    };

    userModel.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, userDB) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                message: err
            });
        }

        res.json({
            ok: true,
            userUpdate: userDB
        });
    });


});

//Actualizar el estado de la información (Elimino la información)
app.delete('/users/:id', [checkToken, checkAdminRole], (req, res) => {
    let id = req.params.id
    let changeStatus = {
        status: false
    };

    //Eliminado físico en la base de datos
    // userModel.findByIdAndRemove(id, (err, userDB) => {
    //     if (err) {
    //         return res.status(404).json({
    //             ok: false,
    //             message: err
    //         });
    //     }

    //     if (userDB === null) {
    //         return res.status(404).json({
    //             ok: false,
    //             error: {
    //                 message: 'El usuario que desea eliminar no existe en la DB'
    //             }
    //         });
    //     }

    //     res.json({
    //         ok: true,
    //         userDeleted: userDB
    //     });
    // });

    //Eliminado lógico (Cambio el status)
    userModel.findByIdAndUpdate(id, changeStatus, { new: true, runValidators: true, context: 'query' }, (err, userDB) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                message: err
            });
        }

        if (userDB === null) {
            return res.status(404).json({
                ok: false,
                error: {
                    message: 'El usuario que desea eliminar no existe en la DB'
                }
            });
        }

        res.json({
            ok: true,
            userEliminated: userDB
        });
    });

});

//Get de un solo usuario
app.get('/users/:id', checkToken, (req, res) => {
    let id = req.params.id;

    userModel.findById(id, (err, userDB) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                message: err
            });
        };

        if (userDB === null) {
            return res.status(404).json({
                ok: false,
                error: {
                    message: 'El usuario que desea buscar no existe en la DB'
                }
            });
        };

        res.json({
            ok: true,
            userFind: userDB
        });
    });

});

module.exports = app;