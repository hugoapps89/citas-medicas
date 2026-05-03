// 🔥 IMPORTS FIREBASE (OBLIGATORIO usar type="module" en HTML)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

console.log("🔥 login.js cargado correctamente");

// 🔧 CONFIGURACIÓN FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyDn-ETfal7IEjghIaZJlbPRTgyOl3BUcKE",
  authDomain: "cita-medica-b4c8c.firebaseapp.com",
  projectId: "cita-medica-b4c8c",
};

// 🚀 INICIALIZAR FIREBASE
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ⏳ ESPERAR A QUE CARGUE EL DOM
document.addEventListener("DOMContentLoaded", () => {

  const btn = document.getElementById("btnLogin");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  // 🛑 VALIDACIONES INICIALES
  if (!btn || !emailInput || !passwordInput) {
    console.error("❌ No se encontraron elementos del DOM");
    return;
  }

  console.log("✅ Elementos encontrados correctamente");

  // 🎯 EVENTO LOGIN
  btn.addEventListener("click", async () => {
    console.log("🔥 Click en login");

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // 🛑 VALIDACIÓN BÁSICA
    if (!email || !password) {
      alert("Completa todos los campos");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      console.log("✅ Login exitoso:", userCredential.user.email);

      // 🚀 REDIRECCIÓN
      window.location.href = "panel.html";

    } catch (error) {
      console.error("❌ Error de login:", error);

      // 🎯 MENSAJES MÁS CLAROS
      let mensaje = "Error al iniciar sesión";

      if (error.code === "auth/user-not-found") {
        mensaje = "Usuario no registrado";
      } else if (error.code === "auth/wrong-password") {
        mensaje = "Contraseña incorrecta";
      } else if (error.code === "auth/invalid-email") {
        mensaje = "Correo inválido";
      }

      alert(mensaje);
    }
  });

});
