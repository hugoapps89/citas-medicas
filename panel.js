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
  apiKey: "AIzaSyDn...",
  authDomain: "cita-medica-b4c8c.firebaseapp.com",
  projectId: "cita-medica-b4c8c",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const container = document.getElementById("appointments");
const doctorName = document.getElementById("doctorName");

window.goHome = () => location.href = "index.html";

onAuthStateChanged(auth, user => {
  if (!user) return location.href = "login.html";

  doctorName.textContent = "Doctor: " + user.email;
  load(user.email);
});

async function load(email) {
  const q = query(collection(db, "appointments"),
    where("doctorId", "==", email)
  );

  const snap = await getDocs(q);
  container.innerHTML = "";

  snap.forEach(docSnap => {
    const a = docSnap.data();

    let div = document.createElement("div");
    div.className = "card";

    const phone = "52" + a.phone.replace(/\D/g, "");

    const msg = `Hola ${a.name}, te recordamos tu cita:
📅 ${a.date}
⏰ ${a.time}`;

    const wa = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;

    div.innerHTML = `
      📅 ${a.date} - ⏰ ${a.time}<br>
      👤 ${a.name}<br>
      📞 ${a.phone}
      <button class="whatsapp" onclick="window.open('${wa}')">💬 Recordar</button>
      <button class="delete">Cancelar</button>
    `;

    div.querySelector(".delete").addEventListener("click", async () => {
      await deleteDoc(doc(db, "appointments", docSnap.id));
      load(email);
    });

    container.appendChild(div);
  });
}
