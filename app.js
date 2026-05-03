import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ✅ TU CONFIG (YA CORRECTA)
const firebaseConfig = {
  apiKey: "AIzaSyDn-ETfal7IEjghIaZJlbPRTgyOl3BUcKE",
  authDomain: "cita-medica-b4c8c.firebaseapp.com",
  projectId: "cita-medica-b4c8c",
  storageBucket: "cita-medica-b4c8c.firebasestorage.app",
  messagingSenderId: "259363349747",
  appId: "1:259363349747:web:26431a342d0638f1994386"
};

// Inicializar
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const baseTimes = ["09:00","10:00","11:00","12:00","16:00","17:00"];

// ELEMENTOS
const doctorEl = document.getElementById("doctor");
const dateEl = document.getElementById("date");
const timeEl = document.getElementById("time");
const btn = document.getElementById("btnAgendar");

// EVENTOS
doctorEl.addEventListener("change", updateTimes);
dateEl.addEventListener("change", updateTimes);
btn.addEventListener("click", book);

// 🔒 Obtener horarios ocupados
async function getBlockedTimes(doctor, date) {
  const q = query(
    collection(db, "appointments"),
    where("doctor", "==", doctor),
    where("date", "==", date)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data().time);
}

// 🔄 Actualizar horarios
async function updateTimes() {
  const doctor = doctorEl.value;
  const date = dateEl.value;

  timeEl.innerHTML = '<option value="">Selecciona horario</option>';

  if (!doctor || !date) return;

  let blocked = [];

  try {
    blocked = await getBlockedTimes(doctor, date);
  } catch (e) {
    console.log("Error Firebase:", e);
  }

  baseTimes.forEach(t => {
    const option = document.createElement("option");

    if (blocked.includes(t)) {
      option.textContent = t + " (Ocupado)";
      option.disabled = true;
    } else {
      option.textContent = t;
      option.value = t;
    }

    timeEl.appendChild(option);
  });
}

// 📲 Agendar cita
async function book() {
  const doctor = doctorEl.value;
  const date = dateEl.value;
  const time = timeEl.value;
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;

  if (!doctor || !date || !time || !name || !phone) {
    alert("Completa todos los campos");
    return;
  }

  const blocked = await getBlockedTimes(doctor, date);

  if (blocked.includes(time)) {
    alert("Ese horario ya está ocupado");
    return;
  }

  await addDoc(collection(db, "appointments"), {
    doctor,
    date,
    time,
    name,
    phone
  });

  alert("Cita agendada");

  updateTimes();
  loadAppointments();
}

// 📋 Cargar citas
async function loadAppointments() {
  const snapshot = await getDocs(collection(db, "appointments"));
  const container = document.getElementById("appointments");

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
      <button class="delete" data-id="${docSnap.id}">Cancelar</button>
    `;

    div.querySelector("button").addEventListener("click", async () => {
      await deleteDoc(doc(db, "appointments", docSnap.id));
      loadAppointments();
      updateTimes();
    });

    container.appendChild(div);
  });
}

loadAppointments();