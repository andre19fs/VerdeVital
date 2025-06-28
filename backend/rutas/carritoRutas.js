const express = require("express");
const router = express.Router();
const carritoControlador = require("../controlador/carritoControlador");



router.get("/", carritoControlador.getCarrito);
router.post("/", carritoControlador.agregarProducto);
router.delete("/", carritoControlador.eliminarProducto);

module.exports = router;