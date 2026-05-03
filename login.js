// 🔥 IMPORTS (requiere type="module")
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

console.log("🔥 Firebase login cargado");

// 🔧 CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyDn-ETfal7IEjghIaZJlbPRTgyOl3BUcKE",
  authDomain: "cita-medica-b4c8c.firebaseapp.com",
  projectId: "cita-medica-b4c8c",
};

// 🚀 INIT
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ⏳ DOM READY
document.addEventListener("DOMContentLoaded", () => {

  const btn = document.getElementById("btnLogin");

  btn.addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      alert("Completa los campos");
      return;
    }

    try {
      const user = await signInWithEmailAndPassword(auth, email, password);

      console.log("✅ Usuario logueado:", user.user.email);

      // 🔐 Guardar sesión manual (extra seguridad UI)
      localStorage.setItem("logueado", "true");

      // 🚀 Redirección
      window.location.href = "panel.html";

    } catch (error) {
      console.error("❌ Error:", error.code);

      let msg = "Error al iniciar sesión";

      if (error.code === "auth/user-not-found") {
        msg = "Usuario no registrado";
      } else if (error.code === "auth/wrong-password") {
        msg = "Contraseña incorrecta";
      } else if (error.code === "auth/invalid-email") {
        msg = "Correo inválido";
      }

      alert(msg);
    }
  });

});
