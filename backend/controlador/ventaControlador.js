const ventaModelo = require("../modelo/ventaModelo");

exports.registrarVenta = (req, res) => {
    const id_usuario = parseInt(req.body.id_usuario);

    if (!id_usuario) {
        return res.status(400).json({ error: "Falta el id_usuario en la solicitud." });
    }

    ventaModelo.agregarVenta(id_usuario, (err, resultado) => {
        if (err) {
            const mensaje = err.message || "";
            if (mensaje.includes("Stock insuficiente")) {
                return res.status(200).json({ error: true, mensaje });
            }
            return res.status(500).json({ error: "Error al registrar la venta", detalle: mensaje });
        }

        res.status(201).json(resultado);
    });
}