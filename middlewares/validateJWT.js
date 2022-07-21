
const { response } = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const validateJWT = async(req, res = response, next) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la peticion https'
        });
    }

    try {

        const {uid} = jwt.verify(token, process.env.SECRET_KEY);
        
        const user = await User.findById(uid);

        if(!user) {
            return res.json({
                msg: 'No existe ese usuario en Base Datos'
            });
        };

        // Verify if user is valid checking his state
        if( !user.state ){
            return res.json({
                msg: 'Este usuario no existe o fue borrado anteriormente'
            });
        };

        req.user = user;
        
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            msg: 'El token no es valido'
        })
    }

};

module.exports = {validateJWT};