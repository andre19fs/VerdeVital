const db = require("../db/db");

exports.obtenerProductos = (callback) => {
    db.all("SELECT * FROM Productos", [], (err, filas) => {
        if (err) {
            console.error("Error al obtener productos:", err);
            return callback(err);
        }
        callback(null, filas);
    });
}

exports.crearProducto = (producto, callback) => {
    const { nombre, Descripcion, stock, categoria, precio_unitario, Imagen } = producto;
    db.run("INSERT INTO Productos (nombre, Descripcion, stock, categoria, precio_unitario, Imagen) VALUES (?, ?, ?, ?, ?, ?)", 
        [nombre, Descripcion, stock, categoria, precio_unitario, Imagen], 
        function(err) {
            if (err) {
                console.error("Error al crear producto:", err);
                return callback(err);
            }
            callback(null, { mensaje: "Producto creado exitosamente", id: this.lastID });
        }
    );

}


exports.actualizarProducto = (id, producto, callback) => {
    const { nombre, Descripcion, stock, categoria, precio_unitario} = producto;
    db.run("UPDATE Productos SET nombre = ?, Descripcion = ?, stock = ?, categoria = ?, precio_unitario = ? WHERE id = ?", 
        [nombre, Descripcion, stock, categoria, precio_unitario, id], 
        function(err) {
            if (err) {
                console.error("Error al actualizar producto:", err);
                return callback(err);
            }
            if (this.changes === 0) {
                return callback(new Error("Producto no encontrado"));
            }
            callback(null, { mensaje: "Producto actualizado exitosamente" });
        }
    );
}