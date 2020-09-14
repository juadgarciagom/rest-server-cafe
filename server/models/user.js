const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

let validRoles = {
    values: ['USER_ROLE', 'ADMIN_ROLE'],
    message: '{VALUE} no es un rol válido'
};

let Schema = mongoose.Schema;

let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    email: {
        type: String,
        required: [true, 'El campo email es requerido'],
        unique: true,
        uniqueCaseInsensitive: true
    },
    password: {
        type: String,
        required: [true, 'Por favor ingrese una contraseña']
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: validRoles
    },
    img: {
        type: String,
        required: false
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.toJSON = function() {
    let userDB = this;
    let userObject = userDB.toObject();
    delete userObject.password;

    return userObject;
};

userSchema.plugin(uniqueValidator, { message: 'The {PATH} is duplicate' });

module.exports = mongoose.model('User', userSchema);