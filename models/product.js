
/*
    name: 'Iphone 13',
    state: true,
    user: 'Onier',
    precio: 800,
    category: "Iphon",
    description: 'Iphone 13 de 128Gb con 98% bateria ...'
    available: true
    amount: 3
    img: 'imgIphone13.jpg'
*/
const {Schema, model} = require('mongoose');


const ProductSchema = Schema({

    name: {
        type: String,
        required: [true, 'Nombre es obligatorio'],
        unique: true
    },
    state: {
        type: Boolean,
        default: true,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    precio: {
        type: String,
        default: 0,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    description: { type: String },
    available: { type: Boolean, default: true },
    amount: {
        type: Number,
        default: 1
    },
    img: { type: String }

});

ProductSchema.methods.toJSON = function() {
    const { __v, _id, state, ...data } = this.toObject();
    data.id = _id;
    return data;
};

module.exports = model('Product', ProductSchema);

