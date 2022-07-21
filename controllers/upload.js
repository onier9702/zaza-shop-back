
const { response } = require("express");
const path = require('path');
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);


const User = require('../models/user');
const Product = require('../models/product');


const handleImageCloudinary = async(req, res = response) => {

    try {

        const { collection, id } = req.params;

        let model;

        switch (collection) {
            case 'users':
                model = await User.findById(id);
                if( !model ){
                    return res.status(400).json({ msg: `Usuario ID: ${id} no existe ` });
                }
                break;

            case 'products':
                model = await Product.findById(id)
                if( !model ){
                    return res.status(400).json({ msg: `Producto ID: ${id} no existe` });
                }
                break;
        
            default:
                return res.status(500).json({ msg: 'Olvide validar esto en mi backend' });
        };

        // cleaning preview images
        if (model.img){
            // delete img from server to avoid duplicates
            const nameArr = model.img.split('/');
            const name    = nameArr[ nameArr.length - 1 ];
            const [ public_id ]    = name.split('.');
            cloudinary.uploader.destroy(public_id);
        };

        // Upload image to cloudinary
        const { tempFilePath } = req.files.file; // file uploaded for user
        const {secure_url} = await cloudinary.uploader.upload(tempFilePath);
        
        model.img = secure_url;   // img added
    
        await model.save();   // save img on database

        if (collection === 'users'){
            return res.status(200).json({
                model
            });
        };

        const prod = Product.findById(id)
                                        .populate('user', 'name')
                                        .populate('category', 'name');

        res.status(200).json({
            model: prod
        });

    
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Ocurrio un error subiendo o actualizando img, reintente o contacte Admin +53 54474824'
        });
    }
};

// controller show up an image
const showImage = async( req, res = response ) => {

    const { collection, id } = req.params;

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if( !model ){
                return res.status(400).json({ msg: `Usuario ID: ${id} no existe ` });
            }
            break;

        case 'products':
            model = await Product.findById(id);
            if( !model ){
                return res.status(400).json({ msg: `Producto ID: ${id} no existe` });
            }
            break;
    
        default:
            return res.status(500).json({ msg: 'Olvide esta collection en mi backend' });
    }

    // checking if exists any image
    if (model.img){
        const resp = await Product.findById(id);
        if (resp){
            return res.status(200).json({img: resp.img});
        } else {
            const response = await User.findById(id);
            return res.status(200).json({img: response.img});
        }
    };

    const pathNotFoundImg = path.join(__dirname, '../assets/no-image.jpg');
    res.sendFile(pathNotFoundImg);

};

module.exports = {
    handleImageCloudinary,
    showImage
}