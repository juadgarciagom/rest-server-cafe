const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categorySchema = new Schema({
    name: {
        type: String,
        unique: true,
        uniqueCaseInsensitive: true,
        required: [true, 'El nombre de la categoria es requerido']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'Ingrese el id del usuario']
    },
    status: {
        type: Boolean,
        default: true
    }
});

categorySchema.plugin(uniqueValidator, { message: 'The {PATH} is duplicate' });

module.exports = mongoose.model('Category', categorySchema);