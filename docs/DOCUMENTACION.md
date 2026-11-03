# Documentación del sitio Conóceme · Crisomber

Sitio estático de páginas educativas para aprender programación, en español.
Publicado en GitHub Pages: https://crisomber.github.io/conoceme/

No usa frameworks, compilación ni dependencias instaladas: solo HTML, CSS y JavaScript.
Lo único externo son las fuentes de Google Fonts y, en el curso de bases de datos, la
librería [sql.js](https://sql.js.org) desde jsDelivr.

---

## 1. Estructura de archivos

```
conoceme/
├── index.html            Portada: hero, Sobre mí, catálogo de cursos, contacto
├── base-de-datos.html    Curso interactivo «Principios de Bases de Datos» (todo en un archivo)
├── wstg.html             Lector de la guía OWASP WSTG traducida
├── wstg/                 Contenido de la guía (generado, no se edita a mano)
│   ├── indice.json       Lista ordenada de las 167 secciones
│   ├── 0-Foreword/ … 6-Appendix/   Fragmentos HTML + imágenes originales
│   └── README.html       Índice original de la guía
├── css/
│   ├── global.css        Compartido: header, enlace «Saltar al contenido», interruptor sol/luna
│   └── inicio.css        Estilos y paleta de la portada
├── js/
│   ├── tema.js           Compartido: tema claro/oscuro (va en el <head>)
│   ├── global.js         Compartido: header que se oculta al bajar (va al final del <body>)
│   └── inicio.js         Portada: genera las tarjetas de cursos
├── img/crisomber.webp    Foto de «Sobre mí»
└── docs/DOCUMENTACION.md Este documento
```

---

## 2. Piezas compartidas

Todas las páginas cargan los tres archivos compartidos, en este orden:

```html
<head>
  …
  <script src="js/tema.js"></script>          <!-- 1. antes del CSS: evita el parpadeo -->
  <link rel="stylesheet" href="css/global.css"> <!-- 2. antes del CSS propio de la página -->
  <!-- CSS propio de la página -->
</head>
<body>
  …
  <script src="js/global.js"></script>        <!-- 3. al final del body -->
</body>
```

### 2.1 Header del sitio

Marcado común (cópialo en cada página nueva):

```html
<a class="skip-link" href="#contenido">Saltar al contenido</a>

<header class="site-header" data-ocultar-al-bajar data-boton-tema>
  <div class="wrap header-inner">
    <a class="brand" href="index.html#inicio" aria-label="Inicio">
      <span class="brand-mark" aria-hidden="true">&gt;_</span>
      <span class="brand-name">Crisomber</span>
    </a>
    <nav aria-label="Principal">
      <ul class="nav-list">
        <li><a href="index.html#sobre-mi">Sobre mí</a></li>
        <li><a href="index.html#cursos">Cursos</a></li>
        <li><a href="index.html#contacto">Contacto</a></li>
      </ul>
    </nav>
  </div>
</header>
```

Opciones por atributo:

| Atributo | Archivo | Qué hace |
|---|---|---|
| `data-ocultar-al-bajar` | `js/global.js` | El header se oculta al hacer scroll hacia abajo y reaparece al subir. El valor opcional es el umbral en píxeles (por defecto `6`): `data-ocultar-al-bajar="20"`. Mientras está oculto lleva la clase `is-hidden`. No se oculta si el foco del teclado está dentro. |
| `data-boton-tema` | `js/tema.js` | Añade el interruptor sol/luna al final de `.header-inner`. |

En pantallas de menos de 520 px se oculta el nombre «Crisomber» y solo queda el icono `>_`.

### 2.2 Tema claro / oscuro (`js/tema.js`)

- Pone `data-theme="light"` o `data-theme="dark"` en `<html>`.
- Si el usuario nunca pulsó el interruptor, sigue el tema del sistema (y cambia si el sistema cambia).
- Al pulsar el interruptor, la elección se guarda en `localStorage` con la clave `tema` y vale para todas las páginas.
- Cada página define sus colores en `:root` y los oscuros en `:root[data-theme="dark"]`.

### 2.3 Variables de color que necesita `global.css`

El header usa la paleta de la página donde está. Cada página debe definir en `:root`:

| Variable | Uso |
|---|---|
| `--bg` | Fondo |
| `--ink` | Texto principal |
| `--muted` | Texto secundario / enlaces del menú |
| `--line` | Bordes |
| `--accent` | Subrayado del enlace activo, foco |
| `--f-display` | Fuente del logotipo |
| `--f-mono` | Fuente del icono `>_` |

---

## 3. Portada (`index.html`)

Secciones, en orden:

| # | `id` | Contenido |
|---|---|---|
| 1 | `inicio` | Hero: titular, botones «Ver los cursos» y «Conóceme», terminal decorativa `ruta-de-aprendizaje.sh` |
| 2 | `sobre-mi` | Foto, presentación y datos cortos (Enfoque, Herramientas, Contenido) |
| 3 | `cursos` | Catálogo de cursos, generado por `js/inicio.js` |
| 4 | `contacto` | Enlaces a GitHub, correo, LinkedIn e Instagram |
| — | footer | Año (lo pone `js/inicio.js`) |

### 3.1 Paleta y tipografía (`css/inicio.css`)

| Variable | Claro | Oscuro |
|---|---|---|
| `--bg` | `#F5F2EA` | `#11161D` |
| `--surface` | `#FFFDF8` | `#18202A` |
| `--ink` | `#17202B` | `#E6ECF2` |
| `--muted` | `#5A6472` | `#9AA7B4` |
| `--accent` | `#B8500E` | `#F0904A` |
| `--ok` | `#1C7A4B` | `#6FD39C` |

Fuentes: **Bricolage Grotesque** (títulos), **IBM Plex Sans** (texto), **JetBrains Mono** (código).
Ancho máximo del contenido: `--wrap: 1120px`.

### 3.2 Añadir o cambiar un curso

Edita el arreglo `CURSOS` al principio de `js/inicio.js`:

```js
{
  titulo: "JavaScript",
  descripcion: "Haz que tus páginas cobren vida: eventos, el DOM y lógica en el navegador.",
  icono: "JS",                      // 2-3 caracteres
  etiquetas: ["DOM", "Eventos"],
  url: "javascript.html",           // null si la página aún no existe
  estado: "disponible",             // "disponible" o "pronto"
},
```

Una tarjeta solo es un enlace si `estado` es `"disponible"` **y** tiene `url`; si no, se
muestra con la etiqueta «Próximamente».

Estado actual del catálogo:

| Curso | Estado |
|---|---|
| Principios de Bases de Datos | Disponible (`base-de-datos.html`) |
| Guía OWASP de pruebas de seguridad web | Disponible (`wstg.html`) |
| Fundamentos de programación | Próximamente |
| HTML y CSS | Próximamente |
| JavaScript | Próximamente |
| Git y GitHub | Próximamente |

### 3.3 Caché

`inicio.css` e `inicio.js` se cargan con `?v=2`. Cuando cambies cualquiera de los dos,
sube el número (`?v=3`) en `index.html` para que los navegadores no usen la versión vieja.

---

## 4. Curso de bases de datos (`base-de-datos.html`)

Todo el curso (HTML, CSS y JavaScript) está en un solo archivo.

### 4.1 Secciones

Se muestra una sección a la vez, con botones «← Anterior / Siguiente →» y un índice de capítulos.

| `id` | Título |
|---|---|
| `cap1` | Qué es una base de datos (incluye una demo paso a paso de cómo se ejecuta una consulta) |
| `cap2` | Conceptos clave |
| `cap3` | Las familias de SQL |
| `cap4` | Comandos esenciales |
| `cap5` | Agrupar y resumir |
| `cap6` | Unir tablas con JOIN |
| `cap7` | Subconsultas, vistas, índices |
| `cap8` | Transacciones y permisos |
| `cap9` | Errores y excepciones |
| `cap10` | Diseño y normalización |
| `retos` | Retos avanzados |
| `examen` | Examen final (10 preguntas al azar) |
| `chuleta` | Chuleta de comandos con buscador |

Cada sección es un `<section class="chap" id="…" data-title="…">`. El título del índice
y de los botones sale de `data-title`. Se puede enlazar directamente a una sección:
`base-de-datos.html#cap6`.

### 4.2 Laboratorio SQL

- Panel lateral que se abre con el botón «Laboratorio SQL».
- Ejecuta **SQLite en el navegador** con sql.js 1.8.0; nada se envía a ningún servidor.
- Base de datos «tienda» con tres tablas: `clientes`, `productos` y `pedidos`
  (definidas en la constante `SCHEMA`).
- «Restaurar datos originales» vuelve a crear la base desde cero.
- Si sql.js no carga (sin conexión), las preguntas siguen funcionando.

### 4.3 Cómo se añade contenido

| Quiero añadir… | Cómo |
|---|---|
| Un bloque de SQL con botón «Probar en el laboratorio» | `<pre class="sql" data-try>SELECT …;</pre>` |
| Un botón suelto que abre el laboratorio con una consulta | `<button data-try-sql="SELECT …;">…</button>` |
| Preguntas de un capítulo | `<div class="quiz" data-quiz="capN"></div>` y las preguntas en `QUIZ.capN` |
| Un ejercicio con corrección automática | `<div class="exercise" data-ex="eN"></div>` y su definición en `EX.eN` |
| Una entrada en la chuleta | Una fila en el arreglo `CHEAT` |

Formato de una pregunta (`QUIZ`):

```js
{ q: "Pregunta", o: ["Opción A", "Opción B", "Opción C", "Opción D"], a: 1, why: "Explicación" }
// a = índice de la respuesta correcta, empezando en 0
```

Formato de un ejercicio (`EX`, hay 24):

```js
e7: {
  t: "Subida de precios",                          // título
  task: "Sube un 10 % el precio de …",             // enunciado (admite HTML)
  solution: "UPDATE productos SET …;",             // solución de referencia
  check: "SELECT id, precio FROM productos ORDER BY id", // opcional: consulta para comparar (ejercicios que modifican datos)
  ordered: true,                                   // opcional: el orden de las filas importa
  hint: "UPDATE … SET precio = precio * 1.10 WHERE …",
}
```

La corrección compara el **resultado** de la consulta del alumno con el de la solución
(los números se redondean a 2 decimales), no el texto. Por eso se aceptan soluciones distintas.

### 4.4 Progreso guardado

Se guarda solo en el navegador del alumno (`localStorage`):

| Clave | Contenido |
|---|---|
| `bd-desde-cero-v1` | Respuestas de preguntas, ejercicios resueltos y mejor nota del examen |
| `bd-desde-cero-v1:seccion` | Última sección abierta |

El botón «Borrar mi progreso» pide confirmación (hay que pulsarlo dos veces).

---

## 5. Guía OWASP WSTG (`wstg.html` + `wstg/`)

Traducción al español del [OWASP Web Security Testing Guide](https://github.com/OWASP/wstg),
con licencia **CC BY-SA 4.0**.

### 5.1 Cómo funciona

- `wstg.html` es un lector: carga `wstg/indice.json`, pinta el índice lateral y, según la
  dirección, descarga el fragmento HTML de la sección con `fetch`.
- Rutas: `wstg.html#/carpeta/archivo` y, para ir a un apartado concreto,
  `wstg.html#/carpeta/archivo@ancla`.
- Sin ruta muestra la portada de la guía con «Empezar a leer».
- Botones «← Anterior / Siguiente →» al final de cada sección.
- Buscador del índice por título, número o ID de prueba (por ejemplo `WSTG-INFO-02`;
  los IDs se reconocen al abrir cada página).
- Cada bloque de código tiene un botón «Copiar».
- Recuerda la última sección leída (`localStorage`, clave `wstg-es:ultima`) y ofrece
  «Continuar donde te quedaste».
- En móvil el índice se abre con el botón «☰ Índice de la guía» y se cierra con `Esc` o tocando fuera.

### 5.2 Formato de `wstg/indice.json`

Arreglo ordenado con una entrada por sección (167 en total, todas traducidas):

```json
{ "r": "3-The_OWASP_Testing_Framework/0-The_Web_Security_Testing_Framework",
  "n": "3.1", "v": 2, "t": "El marco de pruebas de seguridad web", "es": 1 }
```

| Campo | Significado |
|---|---|
| `r` | Ruta del fragmento, sin `.html` (dentro de `wstg/`) |
| `n` | Numeración que se muestra |
| `v` | Nivel de anidación en el índice (1-4) |
| `t` | Título en español |
| `es` | `1` si está traducida; si falta, se avisa de que el texto está en inglés |

**No edites `wstg/` a mano**: los fragmentos se generan desde el Markdown traducido.

> Nota: `wstg.html` usa `fetch`, así que no funciona abriendo el archivo con doble clic
> (`file://`). Pruébalo con un servidor local (ver sección 7).

---

## 6. Crear una página nueva (checklist)

1. Crea `nombre.html` con `lang="es"`, `charset` UTF-8, `viewport`, `<title>` y `meta description`.
2. Carga `js/tema.js` y `css/global.css` en el `<head>` y `js/global.js` al final del `<body>` (sección 2).
3. Copia el header común con `data-ocultar-al-bajar data-boton-tema` y apunta los enlaces a `index.html#…`.
4. Define en `:root` las variables de la sección 2.3 y sus versiones en `:root[data-theme="dark"]`.
5. Pon el contenido principal en un elemento con `id="contenido"` (destino de «Saltar al contenido»).
6. Si guardas progreso, usa una clave de `localStorage` propia y envuelve cada acceso en `try/catch`.
7. Añade la tarjeta en `CURSOS` (`js/inicio.js`) y sube la versión `?v=` en `index.html`.
8. Añade una línea en el `README.md`.

---

## 7. Probar en local y publicar

Para probar todo (incluida la guía WSTG, que necesita `fetch`), sirve la carpeta:

```bash
cd conoceme
python3 -m http.server 8000
# abre http://localhost:8000
```

Publicación: el sitio se sirve con **GitHub Pages** desde la rama configurada en
*Settings → Pages* del repositorio (normalmente `main`). Al fusionar cambios en esa rama,
se publican en https://crisomber.github.io/conoceme/ en un par de minutos.

---

## 8. Pendientes conocidos

- **Contacto** (`index.html`): correo, LinkedIn e Instagram aún muestran `[TU CORREO]`,
  `[TU LINKEDIN]` y `[TU INSTAGRAM]` y apuntan a `#`.
- **Cursos «Próximamente»**: Fundamentos de programación, HTML y CSS, JavaScript, Git y GitHub.
- **Terminal del hero**: anuncia JavaScript como siguiente curso; actualízala si cambia el orden.
