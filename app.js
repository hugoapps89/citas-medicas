import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔥 CONFIG FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyDn-ETfal7IEjghIaZJlbPRTgyOl3BUcKE",
  authDomain: "cita-medica-b4c8c.firebaseapp.com",
  projectId: "cita-medica-b4c8c",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🕒 horarios base
const baseTimes = ["09:00","10:00","11:00","12:00","16:00","17:00"];

// elementos
const doctorEl = document.getElementById("doctor");
const dateEl = document.getElementById("date");
const timeEl = document.getElementById("time");
const btn = document.getElementById("btnAgendar");

// eventos
doctorEl.addEventListener("change", updateTimes);
dateEl.addEventListener("change", updateTimes);
btn.addEventListener("click", book);

// 🔒 obtener horarios ocupados
async function getBlockedTimes(doctorEmail, date) {
  const q = query(
    collection(db, "appointments"),
    where("doctorId", "==", doctorEmail),
    where("date", "==", date)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data().time);
}

// 🔄 actualizar horarios
async function updateTimes() {
  const doctorEmail = doctorEl.value;
  const date = dateEl.value;

  timeEl.innerHTML = '<option value="">Selecciona horario</option>';

  if (!doctorEmail || !date) return;

  let blocked = [];

  try {
    blocked = await getBlockedTimes(doctorEmail, date);
  } catch (error) {
    console.log("Error Firebase:", error);
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

// 📲 agendar cita + WhatsApp
async function book() {

  const doctorEmail = doctorEl.value;
  const doctorName = doctorEl.options[doctorEl.selectedIndex].text;
  const date = dateEl.value;
  const time = timeEl.value;
  const name = document.getElementById("name").value.trim();
  let phone = document.getElementById("phone").value.trim();

  // validación
  if (!doctorEmail || !date || !time || !name || !phone) {
    alert("Completa todos los campos");
    return;
  }

  // evitar doble cita
  const blocked = await getBlockedTimes(doctorEmail, date);

  if (blocked.includes(time)) {
    alert("Ese horario ya está ocupado");
    return;
  }

  // guardar en Firebase
  await addDoc(collection(db, "appointments"), {
    doctor: doctorName,
    doctorId: doctorEmail, // 🔥 clave para filtrar en panel
    date,
    time,
    name,
    phone,
    attended: false,
    createdAt: new Date()
  });

  alert("Cita agendada correctamente");

  // 📱 WhatsApp al paciente
  phone = "52" + phone.replace(/\D/g, "");

  const message = `Hola ${name}, tu cita está confirmada:

👨‍⚕️ ${doctorName}
📅 ${date}
⏰ ${time}

Gracias por agendar`;

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank");

  // refrescar horarios
  updateTimes();

  // limpiar campos
  document.getElementById("name").value = "";
  document.getElementById("phone").value = "";
}
