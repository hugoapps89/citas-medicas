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
  apiKey: "AIzaSyDn...",
  authDomain: "cita-medica-b4c8c.firebaseapp.com",
  projectId: "cita-medica-b4c8c",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const baseTimes = ["09:00","10:00","11:00","12:00","16:00","17:00"];

const doctorEl = document.getElementById("doctor");
const dateEl = document.getElementById("date");
const timeEl = document.getElementById("time");

doctorEl.addEventListener("change", updateTimes);
dateEl.addEventListener("change", updateTimes);

async function getBlockedTimes(doctor, date) {
  const q = query(collection(db, "appointments"),
    where("doctorId", "==", doctor),
    where("date", "==", date)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data().time);
}

async function updateTimes() {
  const doctor = doctorEl.value;
  const date = dateEl.value;

  timeEl.innerHTML = '<option value="">Selecciona horario</option>';
  if (!doctor || !date) return;

  const blocked = await getBlockedTimes(doctor, date);

  baseTimes.forEach(t => {
    let opt = document.createElement("option");
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

// 📲 AGENDAR + WhatsApp
document.getElementById("btnAgendar").addEventListener("click", async () => {

  const doctor = doctorEl.options[doctorEl.selectedIndex].text;
  const doctorId = doctorEl.value;
  const date = dateEl.value;
  const time = timeEl.value;
  const name = document.getElementById("name").value;
  let phone = document.getElementById("phone").value;

  if (!doctorId || !date || !time || !name || !phone) {
    alert("Completa todos los campos");
    return;
  }

  await addDoc(collection(db, "appointments"), {
    doctor,
    doctorId,
    date,
    time,
    name,
    phone
  });

  // 🔥 WhatsApp paciente
  phone = "52" + phone.replace(/\D/g, "");

  const msg = `Hola ${name}, tu cita está registrada:
📅 ${date}
⏰ ${time}
👨‍⚕️ ${doctor}`;

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;

  window.open(url, "_blank");
});
