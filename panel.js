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
const dateEl = document.getElementById("filterDate");
const container = document.getElementById("appointments");

document.getElementById("btnFiltrar").addEventListener("click", loadAppointments);
document.getElementById("btnHoy").addEventListener("click", () => {
  const today = new Date().toISOString().split("T")[0];
  dateEl.value = today;
  loadAppointments();
});

// 🔥 Cargar citas filtradas
async function loadAppointments() {
  const doctor = doctorEl.value;
  const date = dateEl.value;

  if (!doctor) {
    alert("Selecciona doctor");
    return;
  }

  let q = collection(db, "appointments");

  if (doctor && date) {
    q = query(q,
      where("doctor", "==", doctor),
      where("date", "==", date)
    );
  } else if (doctor) {
    q = query(q,
      where("doctor", "==", doctor)
    );
  }

  const snapshot = await getDocs(q);

  container.innerHTML = "";

  if (snapshot.empty) {
    container.innerHTML = "<p>No hay citas</p>";
    return;
  }

  snapshot.forEach(docSnap => {
    const a = docSnap.data();

    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <b>${a.doctor}</b><br>
      📅 ${a.date} - ⏰ ${a.time}<br>
      👤 ${a.name}<br>
      📞 ${a.phone}
      <button class="delete">Cancelar</button>
    `;

    div.querySelector("button").addEventListener("click", async () => {
      await deleteDoc(doc(db, "appointments", docSnap.id));
      loadAppointments();
    });

    container.appendChild(div);
  });
}