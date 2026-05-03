const lista = document.getElementById("listaCitas");

// 🔥 DATOS DE PRUEBA (luego lo conectamos a Firebase)
let citas = [
  {
    id: 1,
    doctor: "Dr. Juan",
    especialidad: "Médico General",
    fecha: "2026-05-04",
    hora: "09:00",
    paciente: "Hugo Caamal",
    telefono: "9995131376",
    atendido: false
  },
  {
    id: 2,
    doctor: "Dr. Juan",
    especialidad: "Médico General",
    fecha: "2026-05-18",
    hora: "09:00",
    paciente: "Hugo Caamal",
    telefono: "9995131376",
    atendido: false
  }
];

// 🧠 Renderizar citas (AQUÍ VAN LOS BOTONES)
function renderCitas() {
  lista.innerHTML = "";

  citas.forEach(cita => {
    const div = document.createElement("div");
    div.className = "cita";

    if (cita.atendido) {
      div.classList.add("atendida");
    }

    div.innerHTML = `
      <strong>${cita.doctor} - ${cita.especialidad}</strong><br>
      📅 ${cita.fecha} ⏰ ${cita.hora}<br>
      👤 ${cita.paciente}<br>
      📞 ${cita.telefono}

      <div class="acciones">
        <button class="btn-cancelar" onclick="cancelarCita(${cita.id})">
          Cancelar
        </button>

        <button class="btn-atendido" onclick="marcarAtendido(${cita.id})">
          Atendido
        </button>

        <button class="btn-recordatorio"
          onclick="enviarRecordatorio('${cita.telefono}', '${cita.fecha}', '${cita.hora}', '${cita.doctor}')">
          Recordatorio
        </button>
      </div>
    `;

    lista.appendChild(div);
  });
}

// ❌ Cancelar
function cancelarCita(id) {
  citas = citas.filter(c => c.id !== id);
  renderCitas();
}

// ✅ ATENDIDO (CLAVE)
function marcarAtendido(id) {
  citas = citas.map(c => {
    if (c.id === id) {
      c.atendido = true;
    }
    return c;
  });

  renderCitas();
}

// 🔔 WHATSAPP (CLAVE)
function enviarRecordatorio(telefono, fecha, hora, doctor) {
  const mensaje = `Hola, te recordamos tu cita con ${doctor} el día ${fecha} a las ${hora}.`;

  const url = `https://wa.me/52${telefono}?text=${encodeURIComponent(mensaje)}`;

  window.open(url, "_blank");
}

// 🚀 INICIO
renderCitas();
