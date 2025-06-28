const carritoModelo = require("../modelo/carritoModelo");

exports.getCarrito = (req, res) => {
    const id_usuario = parseInt(req.query.id_usuario);
    
    carritoModelo.obtenerCarrito(id_usuario, (err, resultado) => {
        if(err){
            return res.status(500).json({ERROR: "Error", mensaje: err.message});
        }
        res.status(200).json(resultado);
    });
};

exports.agregarProducto = (req, res) => {
    const data = req.body;
    
    data.id_usuario = parseInt(data.id_usuario);    
    data.id_producto = parseInt(data.id_producto);  
    data.cantidad = parseInt(data.cantidad);
    data.precio_unitario = parseInt(data.precio_unitario);

    carritoModelo.agregarProducto(data, (err, resultado) => {
        if(err){
            return res.status(500).json({ERROR: "Error", mensaje: err.message});
        }
        res.status(200).json(resultado);
    });
};

exports.eliminarProducto = (req, res) => {
    const id_usuario = parseInt(req.query.id_usuario);
    const id_producto = parseInt(req.query.id_producto);

    carritoModelo.eliminarProducto(id_usuario, id_producto, (err, resultado) => {
        if(err){
            return res.status(500).json({ERROR: "Error", mensaje: err.message});
        }
        res.status(200).json(resultado);
    });
}