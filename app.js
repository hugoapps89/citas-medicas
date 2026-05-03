import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔥 TU CONFIG YA PEGADO
const firebaseConfig = {
  apiKey: "AIzaSyDn-ETfal7IEjghIaZJlbPRTgyOl3BUcKE",
  authDomain: "cita-medica-b4c8c.firebaseapp.com",
  projectId: "cita-medica-b4c8c",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const baseTimes = ["09:00","10:00","11:00","12:00","16:00","17:00"];

const doctorEl = document.getElementById("doctor");
const dateEl = document.getElementById("date");
const timeEl = document.getElementById("time");
const btn = document.getElementById("btnAgendar");

doctorEl.addEventListener("change", updateTimes);
dateEl.addEventListener("change", updateTimes);
btn.addEventListener("click", book);

window.goToPanel = function() {
  let pass = prompt("Clave doctor");
  if (pass === "1234") {
    window.location.href = "panel.html";
  } else {
    alert("Acceso denegado");
  }
}

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

// 🔄 Cargar horarios
async function updateTimes() {
  const doctor = doctorEl.value;
  const date = dateEl.value;

  timeEl.innerHTML = '<option value="">Selecciona horario</option>';

  if (!doctor || !date) return;

  let blocked = [];

  try {
    blocked = await getBlockedTimes(doctor, date);
  } catch (e) {
    console.log(e);
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

// 📲 Agendar
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
    alert("Horario ocupado");
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
}
