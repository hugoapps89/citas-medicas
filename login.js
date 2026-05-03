import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDn-ETfal7IEjghIaZJlbPRTgyOl3BUcKE",
  authDomain: "cita-medica-b4c8c.firebaseapp.com",
  projectId: "cita-medica-b4c8c",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById("btnLogin").addEventListener("click", async () => {

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Completa los campos");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "panel.html";
  } catch (error) {
    console.log("ERROR REAL:", error);

    if (error.code === "auth/user-not-found") {
      alert("Este usuario NO existe en Firebase");
    } else if (error.code === "auth/wrong-password") {
      alert("Contraseña incorrecta");
    } else if (error.code === "auth/invalid-email") {
      alert("Correo mal escrito");
    } else if (error.code === "auth/network-request-failed") {
      alert("Error de conexión (revisa internet o hosting)");
    } else {
      alert("Error: " + error.code);
    }
  }

});
