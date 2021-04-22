/*
path:api/usuarios
*/

const {Router} = require('express');
const { getUsuarios } = require('../controllers/usuarios');
const {validarJWT} = require('../middlewares/valida-JWT');


const router = Router();

router.get('/', validarJWT, getUsuarios);
    

module.exports = router;