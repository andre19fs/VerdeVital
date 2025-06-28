const autenticacion = require('../modelo/autenticacionModelo');

exports.registrarUsuario = (req, res) => {
    const data = req.body;

    if (!data.usuario || !data.contrasena) {
        return res.status(400).json({ ERROR: "Faltan campos requeridos", mensaje: "Usuario y contraseña son obligatorios" });
    }

    autenticacion.registrarUsuario(data, (err, resultado) => {
        if (err) {
            return res.status(500).json({ ERROR: "Error", mensaje: err.message });
        }
        res.status(201).json(resultado);
    });
}

exports.autenticarUsuario = (req, res) => {
    const data = req.body;

    if (!data.usuario || !data.contrasena) {
        return res.status(400).json({ mensaje: "Faltan campos obligatorios" });
    }

    autenticacion.autenticarUsuario(data, (err, resultado) => {
        if (err) {
            
            const errorCredencial = ["Usuario no encontrado", "Credenciales incorrectas"].includes(err.message);
            const statusCode = errorCredencial ? 401 : 500;

            return res.status(statusCode).json({ mensaje: err.message });
        }

        res.status(200).json({ mensaje: "Inicio de sesión exitoso", ...resultado });
    });
};