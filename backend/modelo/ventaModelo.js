const db = require("../db/db");
const { enviarNotificacion } = require("../utils/bot");

exports.agregarVenta = (id_usuario, callback) => {
    db.get("SELECT id FROM Carrito WHERE id_usuario = ?", [id_usuario], (err, carrito) => {
        if (err) return callback(err);
        if (!carrito) return callback(new Error("No se encontró el carrito para este usuario."));
        const id_carrito = carrito.id;

        db.all(`
            SELECT dc.*, p.nombre AS nombre_producto
            FROM Detalle_carrito dc
            JOIN Productos p ON dc.id_producto = p.id
            WHERE dc.id_carrito = ?
        `, [id_carrito], (err, productos) => {
            if (err) return callback(err);
            if (productos.length === 0) return callback(new Error("El carrito está vacío."));

            const total = productos.reduce((acc, item) => acc + item.sub_total, 0);
            const total_productos = productos.reduce((acc, item) => acc + item.cantidad, 0);

            const productosAgrupados = {};
            productos.forEach(producto1 => {
                if (!productosAgrupados[producto1.id_producto]) {
                    productosAgrupados[producto1.id_producto] = {
                        ...producto1,
                        cantidad_total: producto1.cantidad
                    };
                } else {
                    productosAgrupados[producto1.id_producto].cantidad_total += producto1.cantidad;
                }
            });

            const verificarStock = Object.values(productosAgrupados).map(producto => {
                return new Promise((resolve, reject) => {
                    db.get("SELECT stock FROM Productos WHERE id = ?", [producto.id_producto], (err, row) => {
                        if (err) return reject(err);
                        if (!row || row.stock < producto.cantidad_total) {
                            return reject(new Error(`Stock insuficiente para el producto ${producto.nombre_producto}.`));
                        }
                        resolve();
                    });
                });
            });

            Promise.all(verificarStock)
                .then(() => {
                    db.serialize(() => {
                        db.run("BEGIN TRANSACTION");

                        db.get("SELECT usuario FROM Usuarios WHERE id = ?", [id_usuario], (err, usuario) => {
                            if (err) {
                                db.run("ROLLBACK");
                                return callback(err);
                            }

                            const nombre_cliente = usuario.usuario;

                            db.run("INSERT INTO Ventas (id_usuario, total, total_productos) VALUES (?, ?, ?)",
                                [id_usuario, total, total_productos], function (err) {
                                    if (err) {
                                        db.run("ROLLBACK");
                                        return callback(err);
                                    }

                                    const id_venta = this.lastID;

                                    const promesas = productos.map(producto => {
                                        return new Promise((resolve, reject) => {
                                            db.run(`
                                                INSERT INTO Detalle_venta (id_venta, id_producto, cantidad, precio_unitario)
                                                VALUES (?, ?, ?, ?)
                                            `, [id_venta, producto.id_producto, producto.cantidad, producto.precio_unitario], (err) => {
                                                if (err) return reject(err);

                                                db.run("UPDATE Productos SET stock = stock - ? WHERE id = ?",
                                                    [producto.cantidad, producto.id_producto], (err) => {
                                                        if (err) return reject(err);
                                                        resolve();
                                                    });
                                            });
                                        });
                                    });

                                    Promise.all(promesas)
                                        .then(() => {
                                            db.run("DELETE FROM Detalle_carrito WHERE id_carrito = ?", [id_carrito], (err) => {
                                                if (err) {
                                                    db.run("ROLLBACK");
                                                    return callback(err);
                                                }

                                                db.run("COMMIT", (err) => {
                                                    if (err) {
                                                        db.run("ROLLBACK");
                                                        return callback(err);
                                                    }

                                                    let mensaje = `¡Hola ${nombre_cliente}! Tu compra fue exitosa!\n\nDetalles de la compra:\n`;
                                                    productos.forEach(p => {
                                                        mensaje += `- ${p.nombre_producto} x${p.cantidad} $${p.precio_unitario} = $${p.sub_total}\n`;
                                                    });
                                                    mensaje += `\nTotal: $${total}\nGracias por tu compra!`;
                                                    enviarNotificacion({ mensaje });

                                                    return callback(null, { mensaje: "Venta registrada correctamente", id_venta });
                                                });
                                            });
                                        })
                                        .catch(err => {
                                            db.run("ROLLBACK");
                                            console.error("Error al insertar detalle o actualizar stock:", err);
                                            callback(err);
                                        });
                                });
                        });
                    });
                })
                .catch(err => {
                    return callback(err); 
                });
        });
    });
};