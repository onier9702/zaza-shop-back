
const {Router} = require('express');
const { check } = require('express-validator');

const { existsProduct, existsCategory } = require('../helpers/db-validators');
const { validateFields } = require('../middlewares/validateFields');
const { getAllProducts, getOneProductById, createProduct, updatingProductById, deletingProductById } = require('../controllers/products');
const { isSaleRole } = require('../middlewares/validate-role');
const { validateJWT } = require('../middlewares/validateJWT');


const router = Router();

/*
    These routes will have this path: 
    /api/products/
*/

// Getting All products -public
router.get('/', getAllProducts);

// Get one Product by Id -public
router.get('/:id', [
    check('id', 'No es un ID de MongoDB').isMongoId(),  // this route is getting in trouble
    check('id').custom( existsProduct ),
    validateFields,
    ],
    getOneProductById
);

// Create a product - private
router.post('/new', [
    validateJWT,
    isSaleRole,
    check( 'name', 'Escriba un nombre de producto, es obligado' ).not().isEmpty(),
    check('category', 'Categoria ID no existe en base datos').isMongoId(),
    check('category').custom( existsCategory ),
    check('precio', 'El precio es obligatorio').not().isEmpty(),
    validateFields,
    ],
    createProduct
);

// Update a product -private
router.put('/:id', [
    validateJWT,
    isSaleRole,
    check('id', 'No es un id de MongoDB').isMongoId(),
    check('id').custom( existsProduct ),
    validateFields
    ],
    updatingProductById
);

// deleting Product by Id -private
router.delete('/:id', [
    validateJWT,
    isSaleRole,
    check('id', 'No es un ID de MongoDB').isMongoId(),
    check('id').custom( existsProduct ),
    validateFields
    ],
    deletingProductById
)

module.exports = router;