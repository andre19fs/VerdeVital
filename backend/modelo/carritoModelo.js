const db = require("../db/db");



exports.obtenerCarrito = (id_usuario, callback) => {
    db.get("SELECT id FROM Carrito WHERE id_usuario = ?", [id_usuario], (err, carrito) => {
        if (err) return callback(err);
        if (!carrito || !carrito.id) {
            return callback(null, { detalles: [], total: 0 });
        }
        db.all("SELECT dc.id, dc.id_producto, p.nombre AS nombre_producto, dc.cantidad, dc.precio_unitario, dc.sub_total, p.Imagen, p.Descripcion, p.categoria, p.stock FROM Detalle_carrito dc JOIN Productos p ON dc.id_producto = p.id WHERE dc.id_carrito = ?",
             [carrito.id], (err, detalles) => {
            if (err) return callback(err);
            const total = detalles.reduce((acc, item) => acc + item.sub_total, 0);
            callback(null, { carrito: carrito.id, detalles, total });
        });
    });
}

exports.agregarProducto = (data, callback) => {
    const { id_usuario, id_producto, cantidad, precio_unitario} = data;
    db.get("SELECT id FROM Carrito WHERE id_usuario = ?" , [id_usuario], (err, carrito) => {
                if (err) return callback(err);
                if (carrito){
                    detalleCarrito(carrito.id);
                    
                } else{
                        db.run("INSERT INTO Carrito (id_usuario) VALUES (?)",
                            [id_usuario], function (err) {
                                    if (err) {
                                        console.log("Error al insertar en Detalle_carrito:", err);
                                        return callback(err);
                                    } 
                                    detalleCarrito(this.lastID);
                                    
                            }
                        );
                }
                function detalleCarrito(id_carrito) {
                    const sub_total = precio_unitario * cantidad;
                    db.run("INSERT INTO Detalle_carrito (id_carrito, id_producto, cantidad, precio_unitario, sub_total) VALUES (?, ?, ?, ?, ?)",
                        [id_carrito, id_producto, cantidad, precio_unitario, sub_total],
                        function (err) {
                            if (err) {
                                console.log("Error al insertar en Detalle_carrito:", err);
                                return callback(err);
                            }
                            callback(null, {mensaje:"Agregado al carrito", data});
                            
                        }
                    );
                }
        }
    );  

}
exports.eliminarProducto = (id_usuario, id_producto, callback) => {
    db.get("SELECT id FROM Carrito WHERE id_usuario = ?", [id_usuario], (err, carrito) => {
        if (err) return callback(err);
        if (!carrito || !carrito.id) {
            return callback(new Error("Carrito no encontrado para el usuario."));
        }

        db.get(`
            SELECT id 
            FROM Detalle_carrito 
            WHERE id_carrito = ? AND id_producto = ? 
            ORDER BY id ASC 
            LIMIT 1
        `, [carrito.id, id_producto], (err, fila) => {
            if (err) return callback(err);
            if (!fila) return callback(new Error("Producto no encontrado en el carrito."));

            db.run(`
                DELETE FROM Detalle_carrito 
                WHERE id = ?
            `, [fila.id], function (err) {
                if (err) return callback(err);
                callback(null, { mensaje: "Se elimino el producto carrito" });
            });
        });
    });
};