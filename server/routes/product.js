//Dependencias
const express = require('express');
const _ = require('underscore');

const productModel = require('../models/product');

const { checkToken, checkAdminRole } = require('../middlewares/authentication');
const app = express();


//Rutas (Endpoints)

//GET
app.get('/products', checkToken, (req, res) => {
    let since = req.query.since || 0;
    since = parseInt(since)

    let limit = req.query.limit || 5;
    limit = parseInt(limit);

    productModel.find({ status: true }, 'name unit_price category avaible user')
        .skip(since)
        .limit(limit)
        .exec((err, productsDB) => {
            if (err) {
                return res.status(404).json({
                    ok: false,
                    message: err
                });
            };

            productModel.countDocuments({ status: true }, (err, count) => {
                if (err) {
                    return res.status(404).json({
                        ok: false,
                        message: err
                    });
                };

                res.json({
                    ok: true,
                    products: productsDB,
                    total: count
                });
            });
        });
});

//GET de un solo usuario
app.get('/products/:id', checkToken, (req, res) => {
    let id = req.params.id;

    productModel.findById(id, (err, productDB) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                message: err
            });
        };

        if (productDB === null) {
            return res.status(404).json({
                ok: false,
                error: {
                    message: 'El producto que desea buscar no existe en la DB'
                }
            });
        };

        res.json({
            ok: true,
            productFind: productDB
        });
    });
});

//PUT
app.put('/products/:id', [checkToken, checkAdminRole], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'user', 'category', 'unit_price', 'avaible']);

    productModel.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, productDB) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                message: err
            });
        }

        if (productDB === null) {
            return res.status(404).json({
                ok: false,
                error: {
                    message: 'El producto que desea actualizar no existe en la DB'
                }
            });
        };

        res.json({
            ok: true,
            productUpdate: productDB
        });
    });
});

//DELETE
app.delete('/products/:id', [checkToken, checkAdminRole], (req, res) => {
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
    productModel.findByIdAndUpdate(id, changeStatus, { new: true, runValidators: true, context: 'query' }, (err, productDB) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                message: err
            });
        }

        if (productDB === null) {
            return res.status(404).json({
                ok: false,
                error: {
                    message: 'El producto que desea eliminar no existe en la DB'
                }
            });
        }

        res.json({
            ok: true,
            productEliminated: productDB
        });
    });
});

//POST
app.post('/products', [checkToken, checkAdminRole], (req, res) => {
    let body = req.body;

    let product = new productModel({
        name: body.name,
        unit_price: body.unit_price,
        category: body.category,
        avaible: body.avaible,
        user: body.user,
        status: body.status,
    });

    product.save((err, productDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            });
        };

        res.json({
            ok: true,
            product: productDB
        });
    });

});

module.exports = app;