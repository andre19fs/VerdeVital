
const db = require("../db/db");

exports.getProductos = (callback) => {
    db.all("SELECT * FROM Productos", [], callback);
};

exports.getMasVendidos = (callback) => {
    db.all(`
        SELECT 
            p.id, 
            p.nombre AS nombre, 
            p.descripcion AS Descripcion, 
            p.imagen AS Imagen, 
            SUM(dv.cantidad) AS total_vendido
        FROM Productos p
        JOIN Detalle_venta dv ON p.id = dv.id_producto
        GROUP BY p.id
        ORDER BY total_vendido DESC
        LIMIT 3
    `, [], callback);
};
