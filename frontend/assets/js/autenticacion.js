document.addEventListener("DOMContentLoaded", () => {
    const API = "http://localhost:3000";
    const registroForm = document.getElementById("registroForm");
    const loginForm = document.getElementById("loginForm");
    const container = document.querySelector('.container');
    const registerBtn = document.getElementById('btn-register');
    const loginBtn = document.getElementById('btn-login');

 
    registerBtn.addEventListener('click', () => {
        container.classList.add('active');
    });

    loginBtn.addEventListener('click', () => {
        container.classList.remove('active');
    });


    if (registroForm) {
        registroForm.addEventListener("submit", e => {
            e.preventDefault();

            const contrasena = document.getElementById("nuevaContrasena").value.trim();
            const contrasenaRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{}[\]:;"'<>,.?/~`|\\])[A-Za-z\d!@#$%^&*()\-_=+{}[\]:;"'<>,.?/~`|\\]{5,}$/;
            
            if (!contrasenaRegex.test(contrasena)) {
                alert("La contraseña debe tener al menos 6 caracteres, incluir una letra mayúscula, una letra minúscula, un número y un carácter especial.");
                return;
            }

            const nuevoUsuario = {
                usuario: document.getElementById("nuevoUsuario").value.trim(),
                contrasena: contrasena
            };

            fetch(API + "/autenticacion", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoUsuario)
            })
            .then(res => res.json().then(data => ({ ok: res.ok, status: res.status, body: data })))
            .then(({ ok, body }) => {
                if (!ok) {
                    alert("Error: " + body.mensaje);
                    return;
                }
                alert("✅ " + body.mensaje);
                registroForm.reset();
                container.classList.remove('active'); 
            })
            .catch(err => {
                console.error("Error en el fetch:", err);
                alert("❌ Error en la solicitud. Intenta nuevamente.");
            });
        });
    }

  
    if (loginForm) {
        loginForm.addEventListener("submit", e => {
            e.preventDefault();

            const usuario = document.getElementById("usuario").value.trim();
            const contrasena = document.getElementById("contrasena").value.trim();

            if (!usuario || !contrasena) {
                alert("Por favor, completa todos los campos.");
                return;
            }

            const credenciales = { usuario, contrasena };

            fetch(API + "/autenticacion/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credenciales)
            })
            .then(res => res.json().then(data => ({ ok: res.ok, status: res.status, body: data })))
            .then(({ ok, status, body }) => {
                if (!ok) {
                    alert("Error: " + body.mensaje);
                    return;
                }
                alert("✅ " + body.mensaje);
                localStorage.setItem("id_usuario", body.id);
                localStorage.setItem("rol", body.rol);
                window.location.href = "index.html";
            })
            .catch(err => {
                console.error("Error en el fetch:", err);
                alert("❌ Error en la solicitud. Intenta nuevamente.");
            });
        });
    }
});