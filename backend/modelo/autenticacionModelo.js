const db = require("../db/db");
const bcrypt = require("bcryptjs");

exports.registrarUsuario = (data, callback) => {
    const {usuario, contrasena} = data;
    const salt = bcrypt.genSaltSync(10);
    const contrasenaHashed = bcrypt.hashSync(contrasena, salt);

    db.get("SELECT * FROM Usuarios WHERE usuario = ?", [usuario], (err, row) => {
        if (err) {
            console.error("Error al verificar existencia de usuario:", err);
            return callback(err);
        }
        if (row) {
            return callback(new Error("El usuario ya existe."));
        }
        
        db.run("INSERT INTO Usuarios (usuario, contraseña, rol) VALUES (?, ?, ?)", 
        [usuario, contrasenaHashed, "cliente"], 
        function(err) {
            if (err) {
                console.error("Error al registrar usuario:", err);
                return callback(err);
            }
            callback(null, { mensaje: "Usuario registrado exitosamente", id: this.lastID });
        }
    
        );
    });

}

exports.autenticarUsuario = (data, callback) => {
    const { usuario, contrasena } = data;

    db.get("SELECT * FROM Usuarios WHERE usuario = ?", [usuario], (err, usuario) => {
        if (err) return callback(err);

        if (!usuario) return callback(new Error("Usuario no encontrado"));

        bcrypt.compare(contrasena, usuario.contraseña, (err, esValido) => {
            if (err) return callback(err);

            if (!esValido) return callback(new Error("Credenciales incorrectas"));

            callback(null, {
                id: usuario.id,
                usuario: usuario.usuario,
                rol: usuario.rol
            });
        });
    });
};