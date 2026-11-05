# Conóceme · Crisomber

Sitio de páginas educativas para aprender programación: https://crisomber.github.io/conoceme/

- `css/global.css` y `js/global.js` — lo compartido por todas las páginas: el header del sitio y la opción `data-ocultar-al-bajar` (el header se oculta al bajar y reaparece al subir). Cada página nueva debe cargar ambos archivos.
- `js/tema.js` — tema claro/oscuro (se carga en el `<head>`). Con `data-boton-tema` en el header añade el interruptor sol/luna; la elección se recuerda entre páginas.
- `index.html` — página de inicio (sobre mí y catálogo de cursos). Estilos en `css/inicio.css`, tarjetas en `js/inicio.js`.
- `base-de-datos.html` — curso interactivo de bases de datos y SQL en una sola página: conceptos, comandos esenciales, errores y excepciones comunes, preguntas por capítulo, 24 ejercicios con corrección automática, laboratorio SQLite en el navegador (sql.js) y examen final.
- `wstg.html` + `wstg/` — traducción al español del [OWASP Web Security Testing Guide](https://github.com/OWASP/wstg) (CC BY-SA 4.0). `wstg/` contiene fragmentos HTML generados desde el Markdown traducido, las imágenes originales e `indice.json`; no se editan a mano.
- `ingles.html` — curso de gramática inglesa en una sola página, por pestañas (unidad 2: singular y plural, adjetivos, imperativos y let's), con explicaciones en español y 60 ejercicios con corrección automática.
- `fundamentos.html` — curso de fundamentos de programación por pestañas (variables y tipos, condicionales, bucles y funciones), con explicaciones en español y 60 ejercicios con corrección automática.
- `html-css.html` — curso de HTML y CSS por pestañas (estructura HTML, CSS y el modelo de caja, responsive y flexbox), con explicaciones en español y 60 ejercicios con corrección automática.
- `javascript.html` — curso de JavaScript por pestañas (variables y funciones, el DOM, eventos), con explicaciones en español y 60 ejercicios con corrección automática.
- `git-github.html` — curso de Git y GitHub por pestañas (control de versiones, comandos esenciales, GitHub y colaborar), con explicaciones en español y 60 ejercicios con corrección automática.

Todas las páginas de curso por pestañas (`ingles.html`, `fundamentos.html`, `html-css.html`, `javascript.html`, `git-github.html`) comparten la misma arquitectura: variables CSS en `:root` (con su variante de tema oscuro), el mismo motor de ejercicios en JS (tipos "f" de completar y "c" de opción múltiple) y una clave de `localStorage` propia por página para recordar la última pestaña vista.

Abre `index.html` en cualquier navegador o visita la versión publicada en GitHub Pages.
