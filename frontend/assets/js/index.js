document.addEventListener("DOMContentLoaded", () => {
    const API = "http://localhost:3000";
    const contenedorProductos = document.getElementById("productosMasVendidos");

    const mostrarMasVendidos = () => {

        fetch(API + "/producto/masVendidos")
            .then(res => res.json())
            .then(data => {
                contenedorProductos.innerHTML = "";
                data.forEach(producto => {
                    const cuadro = document.createElement("div");
                    cuadro.className = "box";
                    cuadro.innerHTML = `
                        <div class="box-img">
                            <img src="${producto.Imagen}" alt="${producto.nombre}">
                        </div>
                        <h3>${producto.nombre}</h3>
                        <p>Producto más vendido</p>
                        <div class="descripcion">${producto.Descripcion}</div>
                    `;
                    contenedorProductos.appendChild(cuadro);
                });
            });
    };

    mostrarMasVendidos();
});
