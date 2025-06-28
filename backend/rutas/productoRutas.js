const express = require("express");
const router = express.Router();
const productoController = require("../controlador/productoControlador");

router.get('/', productoController.listarProductos);
router.get('/masVendidos', productoController.listarMasVendidos);

module.exports = router;