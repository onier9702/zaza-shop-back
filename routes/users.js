
const {Router} = require('express');
const { check } = require('express-validator');

const {userCreateController, userLoginController, userGetController, userUpdateController, userDeleteController} = require('../controllers/user');
const { emailExists, isValidRole, idExists } = require('../helpers/db-validators');
const { isAdminRole } = require('../middlewares/validate-role');
const { validateFields } = require('../middlewares/validateFields');
const { validateJWT } = require('../middlewares/validateJWT');

const router = Router();

// Create user --public
router.post('/new', [
    check('name', 'El nombre es requerido para el registro').not().isEmpty(),
    check('email', 'El correo es requerido para el registro').isEmail(),
    check('email').custom( emailExists ),
    check('password', 'La contrasena es obligatoria').isLength({min: 6}),
    check('mobile', 'El numero de telefono es obligado').not().isEmpty(),
    validateFields
    ],
    userCreateController
);

// Login User  --private
router.post('/login', [
    check('email', 'El correo es requerido para el registro').isEmail(),
    check('password', 'La contrasena es obligatoria').isLength({min: 6}),
    validateFields
    ],
    userLoginController
);

// Get all users --private , just Admin can do this
router.get('/', [
    validateJWT,
    isAdminRole
    ],
    userGetController
);

// Update an user --private by ID
router.put('/:id', [
    validateJWT,
    check('id', 'Este ID no es valido').isMongoId(),
    check('id').custom( idExists ),
    validateFields
    ],
    userUpdateController
);

// Delete an user --private by ID --Admin Role
router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'Este ID no es valido').isMongoId(),
    check('id').custom( idExists ),
    validateFields
    ],
    userDeleteController
);

module.exports = router;