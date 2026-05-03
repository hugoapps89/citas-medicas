import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
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

const baseTimes = ["09:00","10:00","11:00","12:00","16:00","17:00"];

const doctorEl = document.getElementById("doctor");
const dateEl = document.getElementById("date");
const timeEl = document.getElementById("time");
const btn = document.getElementById("btnAgendar");

doctorEl.addEventListener("change", updateTimes);
dateEl.addEventListener("change", updateTimes);
btn.addEventListener("click", book);

// 🔒 horarios ocupados por doctor (email) + fecha
async function getBlockedTimes(doctorEmail, date) {
  const q = query(
    collection(db, "appointments"),
    where("doctorId", "==", doctorEmail),
    where("date", "==", date)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => d.data().time);
}

// 🔄 pintar horarios
async function updateTimes() {
  const doctorEmail = doctorEl.value;
  const date = dateEl.value;

  timeEl.innerHTML = '<option value="">Selecciona horario</option>';
  if (!doctorEmail || !date) return;

  let blocked = [];
  try {
    blocked = await getBlockedTimes(doctorEmail, date);
  } catch (e) {
    console.log("Error Firebase:", e);
  }

  baseTimes.forEach(t => {
    const opt = document.createElement("option");
    if (blocked.includes(t)) {
      opt.textContent = t + " (Ocupado)";
      opt.disabled = true;
    } else {
      opt.textContent = t;
      opt.value = t;
    }
    timeEl.appendChild(opt);
  });
}

// 📲 agendar (guarda doctorId = email)
async function book() {
  const doctorEmail = doctorEl.value;
  const doctorText = doctorEl.options[doctorEl.selectedIndex]?.text || "";
  const date = dateEl.value;
  const time = timeEl.value;
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;

  if (!doctorEmail || !date || !time || !name || !phone) {
    alert("Completa todos los campos");
    return;
  }

  const blocked = await getBlockedTimes(doctorEmail, date);
  if (blocked.includes(time)) {
    alert("Horario ocupado");
    return;
  }

  await addDoc(collection(db, "appointments"), {
    doctor: doctorText,     // solo visual
    doctorId: doctorEmail,  // 🔑 clave para filtrar por login
    date,
    time,
    name,
    phone,
    createdAt: new Date()
  });

  alert("Cita agendada");
  updateTimes();
}
