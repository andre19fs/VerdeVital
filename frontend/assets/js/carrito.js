document.addEventListener("DOMContentLoaded", () => {
    const API = "http://localhost:3000";
    const contenedorCarrito = document.getElementById("contenedorCarrito");
    const id_usuario = localStorage.getItem("id_usuario");
    const botonInicio = document.getElementById("inicio");

    botonInicio.addEventListener("click", () => {
        window.location.href = "index.html";
    });

    if (!id_usuario) {
        alert("Debes iniciar sesión para acceder a esta sección.");
        window.location.href = "autenticacion.html";
        return;
    }

    const cargarCarrito = () => {
        fetch(`${API}/carrito?id_usuario=${id_usuario}`)
            .then(res => res.json())
            .then(data => {
                contenedorCarrito.innerHTML = "";
                data.detalles.forEach(producto => {
                    const cuadro = document.createElement("div");
                    cuadro.classList.add("producto-carrito");
                    cuadro.innerHTML = `
                        <img src="${producto.Imagen}" style="width:100px;height:auto;">
                        <div><strong>${producto.nombre_producto}</strong></div>
                        <div>Descripción: ${producto.Descripcion}</div>
                        <div>Categoría: ${producto.categoria}</div>
                        <div>Precio unitario: $${producto.precio_unitario}</div>
                        <div>Subtotal: $${producto.sub_total}</div>
                        <button class="eliminar-producto" data-id="${producto.id_producto}">Eliminar</button>
                        <hr>
                    `;
                    contenedorCarrito.appendChild(cuadro);
                });

                const total = document.createElement("div");
                total.classList.add("total-carrito");
                total.innerHTML = `
                    <h3>Total del carrito: $${data.total}</h3>
                    <button id="pagar">Pagar carrito</button>
                `;
                contenedorCarrito.appendChild(total);
                document.getElementById("pagar").addEventListener("click", pagarCarrito);
            });
    };

    const pagarCarrito = () => {
        fetch(API + "/venta", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_usuario })
        })
            .then(res => res.json())
            .then(data =>{
                if (data.error) {
                    alert(data.mensaje || "Error al procesar el pago.");
                    return;
                }
                alert("Pago realizado con éxito. Gracias por tu compra!");
            })
            .catch(err => {
                console.error("Error al procesar el pago:", err);
            });
        
    }

    const eliminarProducto = (id_producto) => {
        fetch(`${API}/carrito?id_usuario=${id_usuario}&id_producto=${id_producto}`, {
            method: "DELETE"
        })
        .then(res => res.json())
        .then(data => {
            alert(data.mensaje || "Producto eliminado del carrito");
            cargarCarrito();
        })
        .catch(err => {
            alert("Error al eliminar producto del carrito");
            console.error(err);
        });
    };
    
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("eliminar-producto")) {
            const id_producto = e.target.getAttribute("data-id");
            eliminarProducto(id_producto);
        }
    });
    cargarCarrito();
});
