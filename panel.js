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

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDn-ETfal7IEjghIaZJlbPRTgyOl3BUcKE",
  authDomain: "cita-medica-b4c8c.firebaseapp.com",
  projectId: "cita-medica-b4c8c",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const container = document.getElementById("appointments");
const doctorNameEl = document.getElementById("doctorName");

// 🔙 volver
window.goHome = function() {
  window.location.href = "index.html";
};

// 🔐 detectar usuario logueado
onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const email = user.email;

  // 👉 mostrar nombre del doctor (puedes mejorar esto luego)
  doctorNameEl.textContent = "Doctor: " + email;

  loadAppointments(email);
});

// 🔥 cargar citas SOLO del doctor logueado
async function loadAppointments(email) {

  const q = query(
    collection(db, "appointments"),
    where("doctorId", "==", email)
  );

  const snapshot = await getDocs(q);

  container.innerHTML = "";

  if (snapshot.empty) {
    container.innerHTML = "<p>No tienes citas aún</p>";
    return;
  }

  snapshot.forEach(docSnap => {
    const a = docSnap.data();

    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      📅 ${a.date} - ⏰ ${a.time}<br>
      👤 ${a.name}<br>
      📞 ${a.phone}
      <button class="delete">Cancelar</button>
    `;

    div.querySelector("button").addEventListener("click", async () => {
      await deleteDoc(doc(db, "appointments", docSnap.id));
      loadAppointments(email);
    });

    container.appendChild(div);
  });
}
