/*
    phat: /api/mensajes
*/

const {Router} = require('express');
const { obtenerChat } = require('../controllers/mensajes');
//const { getUsuarios } = require('../controllers/usuarios');
const {validarJWT} = require('../middlewares/valida-JWT');


const router = Router();

router.get('/:de', validarJWT, obtenerChat);
    

module.exports = router;