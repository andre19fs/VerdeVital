const administracion = require('../modelo/administracionModelo');

exports.obtenerProductos = (req, res) => {
    administracion.obtenerProductos((err, productos) => {
        if (err) {
            return res.status(500).json({ ERROR: "Error al obtener productos", mensaje: err.message });
        }
        res.status(200).json(productos);
    });
}

exports.crearProducto = (req, res) => {
    const producto = req.body;

    if (!producto.nombre || !producto.Descripcion || producto.stock==null || !producto.categoria || producto.precio_unitario==null || !producto.Imagen) {
        return res.status(400).json({ ERROR: "Faltan campos requeridos", mensaje: "Todos los campos son obligatorios" });
    }

    administracion.crearProducto(producto, (err, resultado) => {
        if (err) {
            return res.status(500).json({ ERROR: "Error al crear producto", mensaje: err.message });
        }
        res.status(201).json(resultado);
    });
}   

exports.actualizarProducto = (req, res) => {
    const id = req.params.id;
    const producto = req.body;

    if (!id || !producto.nombre || !producto.Descripcion || producto.stock==null || !producto.categoria || producto.precio_unitario==null) {
        return res.status(400).json({ ERROR: "Faltan campos requeridos", mensaje: "Todos los campos son obligatorios" });
    }

    administracion.actualizarProducto(id, producto, (err, resultado) => {
        if (err) {
            return res.status(500).json({ ERROR: "Error al actualizar producto", mensaje: err.message });
        }
        res.status(200).json(resultado);
    });
}