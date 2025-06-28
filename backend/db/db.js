const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.resolve(__dirname, '../db/verdevital.sqlite'), (err) => {
    if(!err) {
        console.log('Conectado a la base de datos');
        initDB();
    }
});

const initDB = () => {
    db.run(`PRAGMA foreign_keys = ON`);


    db.run(`CREATE TABLE IF NOT EXISTS Productos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        stock INTEGER,
        categoria TEXT,
        precio_unitario INTEGER,
        Imagen TEXT,
        Descripcion TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario TEXT,
        contraseña TEXT,
        rol TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Ventas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_usuario INTEGER,
        total INTEGER,
        total_productos INTEGER,
        fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_usuario) REFERENCES Usuarios(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Detalle_venta (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_venta INTEGER,
        id_producto INTEGER,
        cantidad INTEGER,
        precio_unitario INTEGER,
        sub_total INTEGER,
        FOREIGN KEY (id_venta) REFERENCES Ventas(id),
        FOREIGN KEY (id_producto) REFERENCES Productos(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Carrito (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_usuario INTEGER,
        FOREIGN KEY (id_usuario) REFERENCES Usuarios(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Detalle_carrito (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_carrito INTEGER,
        id_producto INTEGER,
        cantidad INTEGER,
        precio_unitario,
        sub_total,
        FOREIGN KEY (id_carrito) REFERENCES Carrito(id),
        FOREIGN KEY (id_producto) REFERENCES Productos(id)
    )`);
};

module.exports = db;

