import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDn-ETfal7IEjghIaZJlbPRTgyOl3BUcKE",
  authDomain: "cita-medica-b4c8c.firebaseapp.com",
  projectId: "cita-medica-b4c8c",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const doctorEl = document.getElementById("doctor");
const dateEl = document.getElementById("date");
const container = document.getElementById("appointments");

document.getElementById("btnFiltrar").addEventListener("click", load);

// 🔙 volver
window.goHome = function() {
  window.location.href = "index.html";
};

// 🔔 WhatsApp
window.enviarWhatsApp = function(phone, doctor, date, time) {
  const mensaje = `Hola, te recordamos tu cita con ${doctor} el día ${date} a las ${time}.`;

  const url = `https://wa.me/52${phone}?text=${encodeURIComponent(mensaje)}`;

  window.open(url, "_blank");
};

// ✅ Atendido (visual)
window.marcarAtendido = function(btn) {
  const card = btn.closest(".card");
  card.classList.add("atendida");

  btn.innerText = "✔ Atendido";
  btn.disabled = true;
};

// 🔥 cargar citas
async function load() {
  const doctor = doctorEl.value;
  const date = dateEl.value;

  if (!doctor) {
    alert("Selecciona doctor");
    return;
  }

  let q = collection(db, "appointments");

  if (date) {
    q = query(q,
      where("doctor", "==", doctor),
      where("date", "==", date)
    );
  } else {
    q = query(q,
      where("doctor", "==", doctor)
    );
  }

  const snapshot = await getDocs(q);

  container.innerHTML = "";

  snapshot.forEach(docSnap => {
    const a = docSnap.data();

    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <b>${a.doctor}</b><br>
      📅 ${a.date} - ⏰ ${a.time}<br>
      👤 ${a.name}<br>
      📞 ${a.phone}

      <div class="actions">
        <button class="delete">Cancelar</button>

        <button class="atendido">
          ✔ Atendido
        </button>

        <button class="whatsapp">
          <span class="icon">🟢</span> WhatsApp
        </button>
      </div>
    `;

    // ❌ Cancelar
    div.querySelector(".delete").addEventListener("click", async () => {
      await deleteDoc(doc(db, "appointments", docSnap.id));
      load();
    });

    // ✅ Atendido
    div.querySelector(".atendido").addEventListener("click", function() {
      marcarAtendido(this);
    });

    // 🔔 WhatsApp
    div.querySelector(".whatsapp").addEventListener("click", () => {
      enviarWhatsApp(a.phone, a.doctor, a.date, a.time);
    });

    container.appendChild(div);
  });
}
