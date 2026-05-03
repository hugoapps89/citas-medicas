console.log("🔥 login funcionando");

const btn = document.getElementById("btnLogin");

btn.addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  console.log("Intento:", email, password);

  // 🔐 USUARIO DE PRUEBA
  const usuarioCorrecto = "admin@gmail.com";
  const passwordCorrecto = "123456";

  if (email === usuarioCorrecto && password === passwordCorrecto) {
    console.log("✅ Login correcto");

    // Guardar sesión
    localStorage.setItem("logueado", "true");

    // Redirigir
    window.location.href = "panel.html";

  } else {
    alert("❌ Correo o contraseña incorrectos");
  }
});
