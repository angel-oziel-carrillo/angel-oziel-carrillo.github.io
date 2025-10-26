// --- Manejo del modal de login (funciona en cualquier página) ---
document.addEventListener('DOMContentLoaded', function() {
  const loginBtn = document.getElementById('loginBtn');
  const loginModal = document.getElementById('loginModal');
  const closeModal = document.getElementById('closeModal');

  if (loginBtn && loginModal && closeModal) {
    loginBtn.onclick = function() {
      loginModal.style.display = 'block';
    };
    closeModal.onclick = function() {
      loginModal.style.display = 'none';
    };
    window.onclick = function(event) {
      if (event.target === loginModal) {
        loginModal.style.display = 'none';
      }
    };
  }
});

// Capturamos el formulario
const form = document.getElementById("formLogin");

// Escuchamos el evento "submit"
form.addEventListener("submit", async (e) => {
  e.preventDefault(); // evita que la página se recargue

  // Obtener los valores escritos por el usuario
  const login = document.getElementById("login").value;
  const contrasena = document.getElementById("password").value;

  // Enviar los datos al servidor usando fetch + async/await
  try {
    const res = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        cuenta: login, // nombre del campo esperado el backend
        contrasena: contrasena
      })
    });

    // Intentamos parsear el JSON (puede fallar si el servidor responde vacío)
    let data;
    try {
      data = await res.json();
    } catch (parseErr) {
      console.warn("Respuesta no JSON del servidor", parseErr);
      data = {};
    }

    // Revisar la respuesta
    if (res.ok) {
      const cuenta = data.usuario?.cuenta;
      if (cuenta) {
        swal("Correcto!", "Acceso permitido: " + cuenta, "success");
        //alert("Acceso permitido: " + cuenta);
        console.log("Usuario recibido:", data.usuario);

        localStorage.setItem("usuario", cuenta);
        localStorage.setItem("password", contrasena);

        // mostrar el nombre junto al candado
        const userNameSpan = document.getElementById('userName');
        if (userNameSpan) userNameSpan.textContent = cuenta;
        // cerrar modal automáticamente
        const loginModal = document.getElementById('loginModal');
        if (loginModal) loginModal.style.display = 'none';
      } else {
        // Caso inesperado: 200 OK pero sin usuario en body
        console.warn('200 OK sin usuario:', data);
        swal("Error", "Respuesta incompleta del servidor. No se permite el acceso.", "error");
        //alert('Error: respuesta incompleta del servidor. No se permite el acceso.');
      }
    } else {
      // Respuesta de error: mostrar mensaje si viene en el body
      swal("Error", data?.error ?? `Error ${res.status}: ${res.statusText}`, "error");
      //alert(data?.error ?? `Error ${res.status}: ${res.statusText}`);
      // limpiar los campos del formulario tras error
      const loginInput = document.getElementById("login");
      const passInput = document.getElementById("password");
      if (loginInput) loginInput.value = "";
      if (passInput) passInput.value = "";
    }

  } catch (err) {
    console.error("Error al conectar con el servidor:", err);
    swal("Error", "Error de conexión con el servidor", "error");
    //alert("Error de conexión con el servidor");
  }
});