/*
{
    name: 'Onier',
    email: "correo@gmail.com",
    password: '123456',
    img: 'jsafnj,adn',
    role: 'sajasdnj',
    state: true | false,
    address: 'ksfbkjdsjk'
}
*/

const { Schema, model } = require('mongoose');

const UserSchema = Schema({

    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    mobile: {
        type: Number,
        required: [true, 'El numero de telefono es obligado'],
        unique: true
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        emun: ['ADMIN_ROLE', 'USER_ROLE', 'SALE_ROLE']
    },
    state: {
        type: Boolean,
        default: true
    },
    address: {
        type: String,
    },
    tarjeta_CUP: {
        type: String,
        unique: true
    },
    tarjeta_USD: {
        type: String,
        unique: true
    },
});

UserSchema.methods.toJSON = function() {
    const { __v, password, _id, ...user } = this.toObject();
    user.uid = _id;
    return user;
} 

module.exports = model( 'User', UserSchema );