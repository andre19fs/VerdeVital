document.addEventListener("DOMContentLoaded", () => {
    const API = "http://localhost:3000";
    const formAgregar = document.getElementById("formAgregar");
    const rol = localStorage.getItem("rol");
    if (!rol || rol !== "admin") {
        alert("No tienes permisos para acceder a esta sección.");
        window.location.href = "index.html";
        return;
    }
    const tablaProductos = document.getElementById("tablaProductos");
    const cargarProductos = () => {
        if (!tablaProductos) return;
        fetch(API + "/administracion")
            .then(response => response.json())
            .then(productos => {
                tablaProductos.innerHTML = "";
                productos.forEach(producto => {
                    const fila = document.createElement("tr");
                    fila.innerHTML = `
                        <td>${producto.id}</td>
                        <td contenteditable='true' data-campo="nombre">${producto.nombre}</td>
                        <td contenteditable='true' data-campo="categoria">${producto.categoria}</td>
                        <td contenteditable='true' data-campo="precio_unitario">$${producto.precio_unitario}</td>
                        <td contenteditable='true' data-campo="Descripcion">${producto.Descripcion}</td>
                        <td><img src="${producto.Imagen}" alt="${producto.nombre}" width="50"></td>
                        <td contenteditable='true' data-campo="stock">${producto.stock}</td>
                        <td>
                            <button class="btn btn-danger" onclick="actualizarCambios(this, ${producto.id})">Actualizar</button>
                        </td>
                    `;
                    tablaProductos.appendChild(fila);
                });
            })
            .catch(error => console.error("Error al cargar productos:", error));
    }

    if (formAgregar) {
        formAgregar.addEventListener("submit", e => {
            e.preventDefault();
            const nuevoProducto = {
                nombre: document.getElementById("nombre").value.trim(),
                Descripcion: document.getElementById("Descripcion").value.trim(),
                stock: parseInt(document.getElementById("stock").value.trim()),
                categoria: document.getElementById("categoria").value.trim(),
                precio_unitario: parseFloat(document.getElementById("precio_unitario").value.trim()),
                Imagen: document.getElementById("Imagen").value.trim()
            };

            fetch(API + "/administracion", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoProducto)
            }).then(() => {
                formAgregar.reset();
                alert("Producto agregado exitosamente.");
                cargarProductos();
            })
        });
    }

    window.actualizarCambios = (btn, id) => {
        const fila = btn.closest("tr");
        const campos = fila.querySelectorAll("[contenteditable='true']");
        const productoActualizado = { id }
        campos.forEach(campo => {
            const key = campo.dataset.campo;
            if (key) {
                productoActualizado[key] = campo.textContent.trim();
            }
        });
        fetch(API + "/administracion/" + id, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productoActualizado)
        }).then(() => cargarProductos())
            .catch(error => console.error("Error al actualizar producto:", error));
    }

    cargarProductos();
})

