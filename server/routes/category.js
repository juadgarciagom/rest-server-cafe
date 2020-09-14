//Dependencias
const express = require('express');
const _ = require('underscore');

const categoryModel = require('../models/category');
const { checkToken, checkAdminRole } = require('../middlewares/authentication');

const app = express();


//Rutas (Endpoints)

//GET
app.get('/categories', checkToken, (req, res) => {
    let since = req.query.since || 0;
    since = parseInt(since)

    let limit = req.query.limit || 5;
    limit = parseInt(limit);

    categoryModel.find({ status: true }, 'name user')
        .skip(since)
        .limit(limit)
        .exec((err, categoriesDB) => {
            if (err) {
                return res.status(404).json({
                    ok: false,
                    message: err
                });
            };

            categoryModel.countDocuments({ status: true }, (err, count) => {
                if (err) {
                    return res.status(404).json({
                        ok: false,
                        message: err
                    });
                };

                res.json({
                    ok: true,
                    categories: categoriesDB,
                    total: count
                });
            });
        });
});

//GET de una sola categoria
app.get('/categories/:id', checkToken, (req, res) => {
    let id = req.params.id;

    categoryModel.findById(id, (err, categoryDB) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                message: err
            });
        };

        if (categoryDB === null) {
            return res.status(404).json({
                ok: false,
                error: {
                    message: 'La categoria que desea buscar no existe en la DB'
                }
            });
        };

        res.json({
            ok: true,
            categoryFind: categoryDB
        });
    });
});

//PUT
app.put('/categories/:id', [checkToken, checkAdminRole], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'user']);

    categoryModel.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, categoryDB) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                message: err
            });
        }

        if (categoryDB === null) {
            return res.status(404).json({
                ok: false,
                error: {
                    message: 'La categoria que desea actualizar no existe en la DB'
                }
            });
        };

        res.json({
            ok: true,
            categoryUpdate: categoryDB
        });
    });
});

//DELETE
app.delete('/categories/:id', [checkToken, checkAdminRole], (req, res) => {
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
    categoryModel.findByIdAndUpdate(id, changeStatus, { new: true, runValidators: true, context: 'query' }, (err, categoryDB) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                message: err
            });
        }

        if (categoryDB === null) {
            return res.status(404).json({
                ok: false,
                error: {
                    message: 'La categoria que desea eliminar no existe en la DB'
                }
            });
        }

        res.json({
            ok: true,
            categoryEliminated: categoryDB
        });
    });
});

//POST
app.post('/categories', [checkToken, checkAdminRole], (req, res) => {
    let body = req.body;

    let category = new categoryModel({
        name: body.name,
        user: body.user,
        status: body.status
    });

    category.save((err, categoryDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            });
        };

        res.json({
            ok: true,
            category: categoryDB
        });
    });

});

module.exports = app;