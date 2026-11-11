// =========================================================
// Motor de ejercicios por pestañas — compartido por los cursos
// ingles.html, fundamentos.html, html-css.html, javascript.html
// y git-github.html.
//
// Cada página define su propio objeto DATA y llama:
//   Ejercicios.iniciar({ curso: "ingles", data: DATA });
//
// "curso" es el nombre con el que se guarda el progreso en Supabase
// (debe ser único por página). Si el usuario inició sesión
// (window.Cuenta, de js/auth.js), cada respuesta se guarda y se
// restaura automáticamente al volver a abrir la página.
// =========================================================
window.Ejercicios = (function () {
  const norm = (s) => s.toLowerCase().replace(/[’‘`]/g, "'").replace(/[.,!?¿¡]/g, " ").replace(/\s+/g, " ").trim();
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function iniciar({ curso, data }) {
    const DATA = data;

    function render(set) {
      const ol = document.querySelector(`ol[data-set="${set}"]`);
      ol.innerHTML = DATA[set]
        .map((x, i) => {
          const id = `${set}-${i}`;
          if (x.t === "f") {
            const parts = esc(x.q).split("___");
            const inp = `<input type="text" id="${id}" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Respuesta ${i + 1}">`;
            return `<li data-i="${i}"><span class="q">${parts[0]}${inp}${parts[1] || ""}</span> <span class="hint">(${esc(x.h)})</span><span class="fb"></span></li>`;
          }
          const opts = x.o.map((o, j) => `<label><input type="radio" name="${id}" value="${j}">${esc(o)}</label>`).join("");
          return `<li data-i="${i}"><span class="q">${esc(x.q)}</span><div class="opts">${opts}</div><span class="fb"></span></li>`;
        })
        .join("");
      ol.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && e.target.matches("input[type=text]")) check(set);
      });
      document.getElementById(`score-${set}`).textContent = "";
    }

    function check(set, opts = {}) {
      const guardar = opts.guardar !== false;
      let ok = 0;
      document.querySelectorAll(`ol[data-set="${set}"] li`).forEach((li) => {
        const i = +li.dataset.i,
          x = DATA[set][i],
          id = `${set}-${i}`,
          fb = li.querySelector(".fb");
        let good, answered, right, respuesta;
        if (x.t === "f") {
          respuesta = document.getElementById(id).value;
          const v = norm(respuesta);
          answered = v !== "";
          good = x.a.some((a) => norm(a) === v);
          right = x.a[0];
        } else {
          const sel = li.querySelector(`input[name="${id}"]:checked`);
          answered = !!sel;
          respuesta = answered ? sel.value : null;
          good = answered && +sel.value === x.a;
          right = x.o[x.a];
        }
        li.classList.remove("ok", "bad");
        if (good) {
          ok++;
          li.classList.add("ok");
          fb.textContent = "✔ ¡Correcto!" + (x.e ? " " + x.e : "");
        } else {
          li.classList.add("bad");
          fb.textContent = (answered ? "✘ " : "✘ Sin responder. ") + "Respuesta: " + right + (x.e ? " — " + x.e : "");
        }
        if (guardar && answered && window.Cuenta && window.Cuenta.usuario()) {
          window.Cuenta.guardarProgreso(curso, `${set}:${i}`, { respuesta, correcto: good });
        }
      });
      const n = DATA[set].length,
        msg = ok === n ? " 🎉 ¡Perfecto!" : ok >= n * 0.7 ? " 👍 ¡Muy bien!" : " 💪 ¡Repasa la teoría y vuelve a intentarlo!";
      document.getElementById(`score-${set}`).textContent = `Puntuación: ${ok}/${n}` + msg;
    }

    function aplicarProgreso(set, mapa) {
      let huboGuardado = false;
      document.querySelectorAll(`ol[data-set="${set}"] li`).forEach((li) => {
        const i = +li.dataset.i;
        const guardado = mapa.get(`${set}:${i}`);
        if (!guardado) return;
        huboGuardado = true;
        const x = DATA[set][i],
          id = `${set}-${i}`;
        if (x.t === "f") {
          document.getElementById(id).value = guardado.respuesta;
        } else {
          const r = li.querySelector(`input[name="${id}"][value="${guardado.respuesta}"]`);
          if (r) r.checked = true;
        }
      });
      if (huboGuardado) check(set, { guardar: false });
    }

    async function cargarYAplicarTodo() {
      const mapa = await window.Cuenta.cargarProgreso(curso);
      Object.keys(DATA).forEach((set) => aplicarProgreso(set, mapa));
    }

    Object.keys(DATA).forEach(render);
    document.querySelectorAll("[data-check]").forEach((b) => (b.onclick = () => check(b.dataset.check)));
    document.querySelectorAll("[data-reset]").forEach((b) => {
      b.onclick = async () => {
        const set = b.dataset.reset;
        if (window.Cuenta && window.Cuenta.usuario()) await window.Cuenta.borrarProgreso(curso, `${set}:`);
        render(set);
      };
    });

    const tabs = document.querySelectorAll("#tabs button");
    function mostrar(t) {
      tabs.forEach((b) => b.setAttribute("aria-selected", b.dataset.t === t));
      document.querySelectorAll("section.topic").forEach((s) => s.classList.toggle("active", s.id === t));
      try {
        localStorage.setItem(`${curso}-tab`, t);
      } catch (e) {}
      window.scrollTo({ top: 0 });
    }
    tabs.forEach((b) => (b.onclick = () => mostrar(b.dataset.t)));
    try {
      const t = localStorage.getItem(`${curso}-tab`);
      if (t && document.getElementById(t)) mostrar(t);
    } catch (e) {}

    if (window.Cuenta) {
      window.Cuenta.alCambiar((usuario) => {
        if (usuario) cargarYAplicarTodo();
      });
    }
  }

  return { iniciar };
})();
