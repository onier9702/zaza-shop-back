const { response } = require("express");
const bcryptjs = require('bcryptjs');

const User = require('../models/user');
const generateJWT = require("../helpers/generateJWT");

// Revalidate Token
userRevalidateToken
const userRevalidateToken = async( req, res = response ) => {

    try {
        
        const user = await User.findById( req.user._id );

        // verify if user is active( state: true )
        if ( !user.state ){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe o fue borrado anteriormente'
            });
        };

        // Generate JWT
        const token = await generateJWT(req.user._id, req.user.name );

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
        const token = await generateJWT(user.id, user.name);

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
        
        const { limit, since} = req.query;
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

// Get all sellers
const userGetSellersController = async( req, res = response ) => {

    try { 

        const query = {
            $or: [{role: 'SALE_ROLE'}, {role: 'ADMIN_ROLE'}],
            $and: [{ state: true }]
        };
    
        const [ total, users ] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
        ]);
    
        res.status(200).json({
            total,
            sellers: users
        });

    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: 'Contacte al Administrator +53 54474824'
        });
    }
};

// Get One User By id
const userGetOneById = async( req, res = response ) => {

    try {
        
        const {id} = req.params;
    
        const user = await User.findById(id);
        if (!user.state){
            return res.status(400).json({
                ok:false,
                msg: 'El usuario fue borrado anteriormente y ya no existe'
            });
        };
    
        res.status(200).json({
            user
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
    userDeleteController,
    userGetSellersController,
    userGetOneById,
    userRevalidateToken
}