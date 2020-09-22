const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let productSchema = new Schema({
    name: {
        type: String,
        unique: true,
        uniqueCaseInsensitive: true,
        required: [true, 'El nombre es requerido']
    },
    unit_price: {
        type: Number,
        required: [true, 'Por favor ingrese el precio']
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'La id de la categoria del producto es requerida']
    },
    avaible: {
        type: Boolean,
        default: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El id del usuario es requerido']
    },
    status: {
        type: Boolean,
        default: true
    }
});

productSchema.plugin(uniqueValidator, { message: 'The {PATH} is duplicate' });

module.exports = mongoose.model('Product', productSchema);