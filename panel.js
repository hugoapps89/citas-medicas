// 🔐 PROTECCIÓN
if (localStorage.getItem("logueado") !== "true") {
  window.location.href = "index.html";
}

// 📋 DATOS DE PRUEBA (luego será Firebase)
let citas = [
  {
    id: 1,
    nombre: "Juan Pérez",
    telefono: "5219991234567",
    hora: "10:00 AM",
    atendido: false
  },
  {
    id: 2,
    nombre: "María López",
    telefono: "5219999876543",
    hora: "11:30 AM",
    atendido: false
  }
];

// 🔄 RENDER
function renderCitas() {
  const contenedor = document.getElementById("listaCitas");
  contenedor.innerHTML = "";

  citas.forEach(cita => {

    const div = document.createElement("div");
    div.className = "cita";

    if (cita.atendido) {
      div.classList.add("atendido");
    }

    div.innerHTML = `
      <strong>${cita.nombre}</strong><br>
      Hora: ${cita.hora}<br><br>

      <button class="btn-wsp" onclick="enviarWhatsApp('${cita.nombre}', '${cita.telefono}', '${cita.hora}')">
        📲 Recordar por WhatsApp
      </button>

      <button class="btn-ok" onclick="marcarAtendido(${cita.id})">
        ✔ Atendido
      </button>
    `;

    contenedor.appendChild(div);
  });
}

// 📲 WHATSAPP
window.enviarWhatsApp = function(nombre, telefono, hora) {

  const mensaje = `Hola ${nombre}, te recordamos tu cita médica a las ${hora}.`;

  const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;

  window.open(url, "_blank");
};

// ✔ ATENDER
window.marcarAtendido = function(id) {

  citas = citas.map(cita => {
    if (cita.id === id) {
      cita.atendido = true;
    }
    return cita;
  });

  renderCitas();
};

// 🚪 LOGOUT
window.logout = function () {
  localStorage.removeItem("logueado");
  window.location.href = "index.html";
};

// 🚀 INICIO
renderCitas();
