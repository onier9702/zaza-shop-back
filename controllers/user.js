const { response } = require("express");
const bcryptjs = require('bcryptjs');

const User = require('../models/user');
const generateJWT = require("../helpers/generateJWT");

// Create user
const userCreateController = async(req, res = response) => {

    try {
        
        const { name, email, password, mobile, ...rest } = req.body;

        const user = new User( {name, email, password, mobile, rest} );

        // encrypt the password
        const salt = bcryptjs.genSaltSync();
        user.password = bcryptjs.hashSync(password, salt);

        // save on DB
        await user.save();

        res.status(200).json({
            user
        })


    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: 'Contacte al Administrador a este +53 54474824'
        })
    }


};

// Login user
const userLoginController = async(req, res = response) => {

    try {
        
        const { email, password } = req.body;
        const user = await User.findOne( {email} );
        if ( !user ){
            return res.status(400).json({
                ok: false,
                msg: 'El correo o la contrasena son incorrectos'
            });
        };

        // verify if user is active( state: true )
        if ( !user.state ){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe'
            });
        };

        // Verify if correct password
        const validPassword = bcryptjs.compareSync(password, user.password);
        if(!validPassword){
            return res.status(400).json({
                msg: 'El correo o la contrasena son incorrectos'
            });
        };

        // Generate JWT to logged user
        const token = await generateJWT(user.id);

        res.status(200).json({
            user,
            token
        });


    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: 'Contacte al Administrador a este +53 54474824'
        })
    }
};

// Getting All users
const userGetController = async( req, res = response ) => {

    try {
        
        const { limit = 5, since = 0 } = req.query;
        const query = { state: true };
    
        const [ total, users ] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                    .skip(since)
                    .limit(limit)
        ]);
    
        res.status(200).json({
            total,
            users
        });

    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: 'Contacte al Administrator +53 54474824'
        });
    }
};

// Update an User
const userUpdateController = async( req, res = response) => {

    try {

        const { id } = req.params;
        const { _id, password, mobile, email, role, state, ...rest } = req.body;
    
        if ( password ) {   // user wants to update the password
            // encrypt the password
            const salt = bcryptjs.genSaltSync();
            rest.password = bcryptjs.hashSync(password, salt);
        };
    
        const user = await User.findByIdAndUpdate(id, rest, {new: true});
    
        res.status(200).json({
            user
        })
        
    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: 'Contacte al Administrator +53 54474824'
        });
    }
};

// Delete an User
const userDeleteController = async( req, res = response) => {

    try {

        const { id } = req.params;
    
        const userDeleted = await User.findByIdAndUpdate(id, { state: false }, {new: true} );
    
        res.status(200).json({
            userDeleted
        })
        
    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: 'Contacte al Administrator +53 54474824'
        });
    }
};

module.exports = {
    userCreateController,
    userLoginController,
    userGetController,
    userUpdateController,
    userDeleteController
}