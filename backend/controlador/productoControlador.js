const producto = require("../modelo/productoModelo");

exports.listarProductos = (req, res) => {
    producto.getProductos( (err, producto) => {
        if(err){
            return res.status(500).json({ERROR: err.message});
        };
        res.json(producto);
    })
};

exports.listarMasVendidos = (req, res) => {
    producto.getMasVendidos((err, productos) => {
        if(err){
            console.error("Error en listarMasVendidos:", err);
            return res.status(500).json({ERROR: err.message});
        };
        res.json(productos);
    });
}

