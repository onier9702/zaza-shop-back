

const { response } = require('express');
const Product = require('../models/product');

const getAllProducts = async(req, res = response) => {

    try {

        const { limit , since } = req.query;
        const query = { state: true };
    
        const [ total, products ] = await Promise.all( [
            Product.countDocuments(query),
            Product.find(query)
                    .populate('user', 'name')
                    .populate('category', 'name')
                    .skip(since)
                    .limit(limit)
        ] );
    
        res.status(200).json({
            total,
            products
        })
        
    } catch (error) {
        console.log(error);
        res.status(501).json({
            msg: 'Ocurrio un error, reintente y si no funciona despues de reintentar contacte Adiministrador +53 54474824'
        })
    }
};

const getOneProductById = async(req, res = response) => {

    try {

        const {id} = req.params;
        const query = { state: true };
        const existProduct = await Product.findById(id, undefined, query)
                                            .populate('user', 'name')
                                            .populate('category', 'name');
        
        if (  !existProduct ){
            return res.status(400).json({
                msg: 'El id Producto no existe en base datos'
            });
        };
    
        if ( !existProduct.state ){
            return res.status(400).json({
                msg: `El producto con ID: ${id} fue borrado anteriormente`
            });
        };
    
        res.status(200).json({
            product: existProduct
        });
        
    } catch (error) {
        console.log(error);
        res.status(501).json({
            msg: 'Ocurrio un error, reintente y si no funciona despues de reintentar contacte Adiministrador +53 54474824'
        });
    }

};

const createProduct = async(req , res = response) => {

    try {

        const { name, user, state, ...body } = req.body;
        
        const test = await Product.findOne({name});

        if ( test ) {
            return res.status(400).json({
                msg: `El producto ${name} ya existe`
            });
        };
    
        const data = {
            ...body,
            name: name.toUpperCase(),
            user: req.user._id,
        };
    
        const product = new Product(data);
    
        await product.save();

        const prod = await Product.findById(product._id)
                                                .populate('user', 'name')
                                                .populate('category', 'name');
    
        res.status(201).json({
            product: prod
        });
        
    } catch (error) {
        console.log(error);
        res.status(501).json({
            msg: 'Ocurrio un error, reintente y si no funciona despues de reintentar contacte Adiministrador +53 54474824'
        });
    }
};

const updatingProductById = async(req, res = response) => {

    try {

        const {id} = req.params;
        const { category, state, user, ...rest } = req.body;
    
        if(rest.name){
            rest.name = rest.name.toUpperCase();
        };
        // rest.user = req.user._id;
    
    
        const product = await Product.findByIdAndUpdate(id, rest, {new: true})
                                            .populate('user', 'name')
                                            .populate('category', 'name');
    
        res.status(200).json({
            product
        });
        
    } catch (error) {
        console.log(error);
        res.status(501).json({
            msg: 'Ocurrio un error, reintente y si no funciona despues de reintentar contacte Adiministrador +53 54474824'
        });
    }

};

const deletingProductById = async(req, res = response) => {

    try {
        
        const {id} = req.params;
    
        const product = await Product.findByIdAndUpdate(id, {state: false}, {new: true})
                                                .populate('user', 'name')
                                                .populate('category', 'name');
    
        res.status(200).json({
            product
        });
        
    } catch (error) {
        console.log(error);
        res.status(501).json({
            msg: 'Ocurrio un error, reintente y si no funciona despues de reintentar contacte Adiministrador +53 54474824'
        });
    }

};

module.exports = {
    getAllProducts,
    createProduct,
    getOneProductById,
    updatingProductById,
    deletingProductById
}