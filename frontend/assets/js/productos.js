document.addEventListener("DOMContentLoaded", function () {
    const API = "http://localhost:3000";
    const contenedorProductos = document.getElementById("contenedorProductos");
    const searchInput = document.getElementById("searchInput");
    const id_usuario = localStorage.getItem("id_usuario");

    if (!id_usuario) {
        alert("Debes iniciar sesión para acceder a esta sección.");
        window.location.href = "autenticacion.html";
        return;
    }

    const cargarProductos = (productos) => {
        contenedorProductos.innerHTML = "";
        productos.forEach(producto => {
            const cuadro = document.createElement("div");
            cuadro.className = "producto";
            cuadro.innerHTML = `
                <img src="${producto.Imagen}" alt="${producto.nombre}">
                <div class="producto-nombre">${producto.nombre}</div>
                <div class="producto-descripcion">${producto.Descripcion}</div>
                <div class="producto-disponibilidad" id="disponibilidad">Disponibilidad: ${producto.stock > 0 ? "Disponible" : "No disponible"}</div>
                <div class="producto-categoria">Categoría: ${producto.categoria}</div>
                <div class="producto-precio">Precio: $${producto.precio_unitario}</div>
                ${producto.stock > 0
                    ? `<button class="agregarCarrito" data-id="${producto.id}" data-precio="${producto.precio_unitario}"><i class="fas fa-cart-plus"></i> Agregar al carrito</button>`
                    : `<button disabled class="sin-stock"><i class="fas fa-times-circle"></i> Sin stock</button>`
                }
            `;
            contenedorProductos.appendChild(cuadro);
        });
        agregarProductoCarrito();
    };

    const agregarProductoCarrito = () => {
        const botonCarrito = document.querySelectorAll(".agregarCarrito");
        botonCarrito.forEach(btn => {
            btn.addEventListener("click", (e) => {
                const idProducto = parseInt(e.target.getAttribute("data-id"));
                const cantidad = 1;
                const precioUnitario = parseInt(e.target.getAttribute("data-precio"));
                agregarProducto(id_usuario, idProducto, cantidad, precioUnitario);
            });
        });
    };

    const agregarProducto = (id_usuario, id_producto, cantidad, precio_unitario) => {
        const producto = {
            id_usuario,
            id_producto,
            cantidad,
            precio_unitario
        };

        fetch(API + "/carrito", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(producto)
        })
        .then(res => res.json())
        .then(data => {
            alert("Agregado al carrito");
        })
        .catch(err => {
            alert("Error al agregar producto al carrito");
        });
    };

    const buscarProductos = () => {
        const searchTerm = searchInput.value.toLowerCase();
        fetch(API + "/producto")
            .then(res => res.json())
            .then(data => {
                const productosFiltrados = data.filter(producto =>
                    producto.nombre.toLowerCase().includes(searchTerm) ||
                    producto.Descripcion.toLowerCase().includes(searchTerm) ||
                    producto.categoria.toLowerCase().includes(searchTerm)
                );
                cargarProductos(productosFiltrados);
            });
    };

    searchInput.addEventListener("input", buscarProductos);

    fetch(API + "/producto")
        .then(res => res.json())
        .then(data => {
            cargarProductos(data);
        });
});


