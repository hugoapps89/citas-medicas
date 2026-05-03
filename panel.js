const logueado = localStorage.getItem("logueado");

if (logueado !== "true") {
  window.location.href = "index.html";
}

function logout() {
  localStorage.removeItem("logueado");
  window.location.href = "index.html";
}
