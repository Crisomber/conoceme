// =========================================================
// Página de inicio — tarjetas de cursos
//
// Para añadir un curso nuevo, agrega un objeto a CURSOS:
//   titulo       Nombre del curso
//   descripcion  Una o dos frases
//   icono        2-3 caracteres que se muestran en el recuadro
//   etiquetas    Lista corta de temas
//   url          Ruta a la página del curso (déjala en null si aún no existe)
//   estado       "disponible" o "pronto"
// =========================================================

const CURSOS = [
  {
    titulo: "Principios de Bases de Datos",
    descripcion: "Modelo relacional, SQL esencial, 24 ejercicios con corrección automática y un laboratorio SQLite en el navegador.",
    icono: "DB",
    etiquetas: ["SQL", "SQLite", "Ejercicios"],
    url: "base-de-datos.html",
    estado: "disponible",
  },
  {
    titulo: "Guía OWASP de pruebas de seguridad web",
    descripcion: "Traducción al español del OWASP WSTG: la metodología de referencia para evaluar la seguridad de aplicaciones web, prueba por prueba.",
    icono: "SEC",
    etiquetas: ["Ciberseguridad", "Pentesting", "OWASP"],
    url: "wstg.html",
    estado: "disponible",
  },
  {
    titulo: "Fundamentos de programación",
    descripcion: "Variables, condiciones, bucles y funciones: la base para cualquier lenguaje.",
    icono: "{ }",
    etiquetas: ["Lógica", "Algoritmos"],
    url: null,
    estado: "pronto",
  },
  {
    titulo: "HTML y CSS",
    descripcion: "Construye y da estilo a tus propias páginas web, desde la primera etiqueta hasta el diseño responsive.",
    icono: "</>",
    etiquetas: ["HTML", "CSS", "Responsive"],
    url: null,
    estado: "pronto",
  },
  {
    titulo: "JavaScript",
    descripcion: "Haz que tus páginas cobren vida: eventos, el DOM y lógica en el navegador.",
    icono: "JS",
    etiquetas: ["DOM", "Eventos"],
    url: null,
    estado: "pronto",
  },
  {
    titulo: "Git y GitHub",
    descripcion: "Guarda el historial de tu código, colabora y publica tus proyectos en internet.",
    icono: "git",
    etiquetas: ["Control de versiones", "GitHub Pages"],
    url: null,
    estado: "pronto",
  },
];

const ESTADOS = {
  disponible: { texto: "Disponible", clase: "badge-disponible" },
  pronto: { texto: "Próximamente", clase: "badge-pronto" },
};

function crearTarjeta(curso) {
  const disponible = curso.estado === "disponible" && curso.url;
  const estado = ESTADOS[disponible ? "disponible" : "pronto"];

  const li = document.createElement("li");
  li.className = "card " + (disponible ? "is-disponible" : "is-pronto");

  const head = document.createElement("div");
  head.className = "card-head";
  const icono = document.createElement("span");
  icono.className = "card-icon";
  icono.setAttribute("aria-hidden", "true");
  icono.textContent = curso.icono;
  const badge = document.createElement("span");
  badge.className = "badge " + estado.clase;
  badge.textContent = estado.texto;
  head.append(icono, badge);

  const titulo = document.createElement("h3");
  titulo.className = "card-title";
  if (disponible) {
    const a = document.createElement("a");
    a.href = curso.url;
    a.textContent = curso.titulo;
    titulo.append(a);
  } else {
    titulo.textContent = curso.titulo;
  }

  const desc = document.createElement("p");
  desc.textContent = curso.descripcion;

  const tags = document.createElement("ul");
  tags.className = "card-tags";
  tags.setAttribute("aria-label", "Temas");
  for (const etiqueta of curso.etiquetas || []) {
    const t = document.createElement("li");
    t.textContent = etiqueta;
    tags.append(t);
  }

  li.append(head, titulo, desc, tags);

  if (disponible) {
    const cta = document.createElement("p");
    cta.className = "card-cta";
    cta.setAttribute("aria-hidden", "true");
    cta.textContent = "Empezar curso →";
    li.append(cta);
  }
  return li;
}

document.getElementById("lista-cursos").replaceChildren(...CURSOS.map(crearTarjeta));
document.getElementById("anio").textContent = new Date().getFullYear();
