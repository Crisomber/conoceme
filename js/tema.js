// =========================================================
// Tema claro / oscuro — compartido por todas las páginas
// Cárgalo en el <head>, ANTES del CSS de la página, para que la página
// se pinte directamente con el tema correcto (sin parpadeo):
//   <script src="js/tema.js"></script>
//
// Pone data-theme="light" o "dark" en <html>. Cada página define sus
// colores oscuros en :root[data-theme="dark"].
//
// Opción: interruptor sol/luna en el header
//   <header class="site-header" data-boton-tema>
// El botón se añade al final de .header-inner (estilos en css/global.css).
// =========================================================
{
  const CLAVE = "tema";
  const sistemaOscuro = window.matchMedia("(prefers-color-scheme: dark)");

  function temaGuardado() {
    try { return localStorage.getItem(CLAVE); } catch { return null; }
  }

  function aplicar(tema) {
    document.documentElement.dataset.theme = tema;
    document.querySelectorAll(".theme-toggle").forEach((boton) => {
      const oscuro = tema === "dark";
      boton.setAttribute("aria-checked", String(oscuro));
      boton.title = oscuro ? "Cambiar a modo claro" : "Cambiar a modo oscuro";
    });
  }

  // Sin elección guardada se sigue el tema del sistema, también si cambia
  aplicar(temaGuardado() || (sistemaOscuro.matches ? "dark" : "light"));
  sistemaOscuro.addEventListener("change", (e) => {
    if (!temaGuardado()) aplicar(e.matches ? "dark" : "light");
  });

  function crearBoton() {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "theme-toggle";
    boton.setAttribute("role", "switch");
    boton.setAttribute("aria-label", "Modo oscuro");
    boton.innerHTML =
      '<span class="tt-cielo tt-dia" aria-hidden="true"><span class="tt-nubes"></span></span>' +
      '<span class="tt-cielo tt-noche" aria-hidden="true"><span class="tt-estrellas"></span></span>' +
      '<span class="tt-astro" aria-hidden="true"></span>';
    boton.addEventListener("click", () => {
      const nuevo = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      try { localStorage.setItem(CLAVE, nuevo); } catch {}
      aplicar(nuevo);
    });
    return boton;
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-boton-tema]").forEach((header) => {
      (header.querySelector(".header-inner") || header).append(crearBoton());
    });
    aplicar(document.documentElement.dataset.theme);
  });
}
