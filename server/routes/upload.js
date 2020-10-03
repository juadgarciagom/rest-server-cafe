const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const app = express();

const User = require('../models/user');
const Product = require('../models/product')


app.use(fileUpload());

app.put('/upload/:type/:id', function(req, res) {
    //Obtener el parametro (en este caso tipo)

    let type = req.params.type;
    let id = req.params.id;

    //Se valida cuando no llegue ningún archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            error: {
                message: 'No se ha seleccionado ningún archivo para adjuntar'
            }
        });
    }

    //Validar la ruta a donde va a ir el upload

    let routes = ['products', 'users', 'categories'];

    if (routes.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            error: {
                type_sended: type,
                message: `La imagen que quiere subir no es de una ruta válida. Rutas válidas: ${routes.join(', ')}`
            }
        });
    };

    //Recibir un archivo y proceso

    let file = req.files.file;

    let name = file.name.split('.');

    let fileExtension = name[name.length - 1]

    //Extensiones válidas
    let extension = ['png', 'jpg', 'gif', 'jepg']

    if (extension.indexOf(fileExtension) < 0) {
        return res.status(400).json({
            ok: false,
            error: {
                message: `La extensión del archivo es: .${fileExtension}. La imagen a subir no posee una extensión válida. Extensiones válidas: ${extension.join(', ')}`
            }
        });
    }

    //Personalizar el nombre del archivo de acuerdo al usuario
    let fileName = `${id}-${new Date().getMilliseconds()}.${fileExtension}`

    file.mv(`uploads/${type}/${fileName}`, function(err) {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //Validar si es un usuario o un producto o una categoria
        if (type === 'users') {
            uploadImgUser(id, fileName, res)
        } else if (type === 'products') {
            uploadImgPro(id, fileName, res)
        }

    });

});

//Función para cargar la img del usuario
function uploadImgUser(id, fileName, res) {

    User.findById(id, (err, userDB) => {
        if (err) {
            deleteImg(fileName, 'users')
            return res.status(404).json({
                ok: false,
                err
            });
        }

        if (userDB === null) {
            deleteImg(fileName, 'users')
            return res.status(404).json({
                ok: false,
                error: {
                    message: 'El usuario que desea buscar no existe en la DB'
                }
            });
        };

        //Validar si la img ya existe
        deleteImg(userDB.img, 'users')

        userDB.img = fileName;

        userDB.save((err, userSaved) => {
            if (err) {
                return res.status(404).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                message: 'Image uploaded!',
                userDB: userSaved,
                img: fileName
            });
        });

    });
};

//Funcion para cargar la img del producto
function uploadImgPro(id, fileName, res) {

    Product.findById(id, (err, productDB) => {
        if (err) {
            deleteImg(fileName, 'products')
            return res.status(404).json({
                ok: false,
                err
            });
        }

        if (productDB === null) {
            deleteImg(fileName, 'products')
            return res.status(404).json({
                ok: false,
                error: {
                    message: 'El producto que desea buscar no existe en la DB'
                }
            });
        };

        //Validar si la img ya existe
        deleteImg(productDB.img, 'products')

        productDB.img = fileName;

        productDB.save((err, productSaved) => {
            if (err) {
                return res.status(404).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                message: 'Image uploaded!',
                productDB: productSaved,
                img: fileName
            });
        });

    });
};


function deleteImg(nameImg, type) {
    let pathImg = path.resolve(__dirname, `../../uploads/${type}/${nameImg}`);

    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
    };
};

module.exports = app;