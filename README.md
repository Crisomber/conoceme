# Conóceme · Crisomber

Sitio de páginas educativas para aprender programación: https://crisomber.github.io/conoceme/

- `css/global.css` y `js/global.js` — lo compartido por todas las páginas: el header del sitio y la opción `data-ocultar-al-bajar` (el header se oculta al bajar y reaparece al subir). Cada página nueva debe cargar ambos archivos.
- `js/tema.js` — tema claro/oscuro (se carga en el `<head>`). Con `data-boton-tema` en el header añade el interruptor sol/luna; la elección se recuerda entre páginas.
- `index.html` — página de inicio (sobre mí y catálogo de cursos). Estilos en `css/inicio.css`, tarjetas en `js/inicio.js`.
- `base-de-datos.html` — curso interactivo de bases de datos y SQL en una sola página: conceptos, comandos esenciales, errores y excepciones comunes, preguntas por capítulo, 24 ejercicios con corrección automática, laboratorio SQLite en el navegador (sql.js) y examen final.

Abre `index.html` en cualquier navegador o visita la versión publicada en GitHub Pages.
