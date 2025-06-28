const express = require("express"); 
const router = express.Router();
const administracionController = require("../controlador/administracionControlador");

router.get('/', administracionController.obtenerProductos);
router.post('/', administracionController.crearProducto); 
router.put('/:id', administracionController.actualizarProducto); 

module.exports = router;