const express = require("express");
const router = express.Router();
const ventaControlador = require("../controlador/ventaControlador");


router.post("/", ventaControlador.registrarVenta);

module.exports = router;