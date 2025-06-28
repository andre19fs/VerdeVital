const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db/db');
const productoRutas = require("../backend/rutas/productoRutas");
const carritoRutas = require("../backend/rutas/carritoRutas");
const ventaRutas = require("../backend/rutas/ventaRutas");
const autenticacionRutas = require("../backend/rutas/autenticacionRutas");
const administracionRutas = require("../backend/rutas/administracionRutas");


const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use("/producto", productoRutas);
app.use("/carrito", carritoRutas);
app.use("/venta", ventaRutas);
app.use("/autenticacion", autenticacionRutas);
app.use("/administracion", administracionRutas);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
