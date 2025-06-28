const express = require('express');
const router = express.Router();
const autenticacionControlador = require('../controlador/autenticacionControlador');

router.post('/', autenticacionControlador.registrarUsuario);
router.post('/login', autenticacionControlador.autenticarUsuario);


module.exports = router;