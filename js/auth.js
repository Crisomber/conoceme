// =========================================================
// Cuenta y progreso — compartido por todas las páginas
// Cárgalo al final del <body>, después del script de Supabase y antes
// de js/global.js (o en cualquier orden después del script de Supabase,
// no importa mientras sea antes de usarlo):
//   <script src="https://unpkg.com/@supabase/supabase-js@2.47.10/dist/umd/supabase.js"></script>
//   <script src="js/auth.js"></script>
//
// Con data-boton-cuenta en el header añade el botón de cuenta:
//   <header class="site-header" data-boton-cuenta>
// El botón se añade al final de .header-inner (estilos en css/global.css).
//
// Expone window.Cuenta con:
//   Cuenta.usuario()                        -> objeto de usuario o null
//   Cuenta.alCambiar(cb)                    -> cb(usuario|null) ahora y en cada cambio
//   Cuenta.guardarProgreso(curso, clave, valor)   -> Promise
//   Cuenta.cargarProgreso(curso)                  -> Promise<Map clave->valor>
//   Cuenta.borrarProgreso(curso, prefijoClave)    -> Promise (borra las claves que empiezan con el prefijo)
// =========================================================
{
  const URL_PROYECTO = "https://apqltzxlcmtsoxypmvcd.supabase.co";
  const LLAVE_PUBLICA = "sb_publishable_1dTrQXOnfeD9jBlyfmYmxA_U45WXrT1";

  const sb = window.supabase.createClient(URL_PROYECTO, LLAVE_PUBLICA);

  const listeners = [];
  let usuarioActual = null;

  function notificar() {
    listeners.forEach((cb) => cb(usuarioActual));
  }

  sb.auth.getSession().then(({ data }) => {
    usuarioActual = data.session ? data.session.user : null;
    notificar();
  });

  sb.auth.onAuthStateChange((_evento, session) => {
    usuarioActual = session ? session.user : null;
    notificar();
  });

  async function guardarProgreso(curso, clave, valor) {
    if (!usuarioActual) return;
    return sb.from("progreso").upsert(
      {
        user_id: usuarioActual.id,
        curso,
        clave,
        valor,
        actualizado_en: new Date().toISOString(),
      },
      { onConflict: "user_id,curso,clave" }
    );
  }

  async function cargarProgreso(curso) {
    const mapa = new Map();
    if (!usuarioActual) return mapa;
    const { data, error } = await sb
      .from("progreso")
      .select("clave, valor")
      .eq("curso", curso);
    if (error) {
      console.error("No se pudo cargar el progreso:", error.message);
      return mapa;
    }
    (data || []).forEach((fila) => mapa.set(fila.clave, fila.valor));
    return mapa;
  }

  async function borrarProgreso(curso, prefijoClave) {
    if (!usuarioActual) return;
    return sb
      .from("progreso")
      .delete()
      .eq("curso", curso)
      .like("clave", `${prefijoClave}%`);
  }

  window.Cuenta = {
    usuario: () => usuarioActual,
    alCambiar(cb) {
      listeners.push(cb);
      cb(usuarioActual);
    },
    guardarProgreso,
    cargarProgreso,
    borrarProgreso,
  };

  // -------------------- Widget de cuenta en el header --------------------

  function textoError(error) {
    const msg = (error && error.message) || "";
    if (/already registered|already exists/i.test(msg)) return "Ese correo ya tiene una cuenta. Intenta iniciar sesión.";
    if (/invalid login credentials/i.test(msg)) return "Correo o contraseña incorrectos.";
    if (/password should be at least/i.test(msg)) return "La contraseña debe tener al menos 6 caracteres.";
    if (/unable to validate email/i.test(msg) || /invalid email/i.test(msg)) return "Ese correo no parece válido.";
    if (/email not confirmed/i.test(msg)) return "Confirma tu correo antes de iniciar sesión (revisa tu bandeja de entrada).";
    return msg || "Algo salió mal. Intenta de nuevo.";
  }

  function crearModal() {
    const fondo = document.createElement("div");
    fondo.className = "cuenta-modal-fondo";
    fondo.hidden = true;

    fondo.innerHTML = `
      <div class="cuenta-modal" role="dialog" aria-modal="true" aria-labelledby="cuenta-modal-titulo">
        <button type="button" class="cuenta-modal-cerrar" aria-label="Cerrar">✕</button>
        <div class="cuenta-tabs" role="tablist">
          <button type="button" role="tab" aria-selected="true" data-modo="entrar">Iniciar sesión</button>
          <button type="button" role="tab" aria-selected="false" data-modo="registrar">Crear cuenta</button>
        </div>
        <h2 id="cuenta-modal-titulo" class="cuenta-modal-titulo">Inicia sesión</h2>
        <p class="cuenta-modal-sub">Guarda tu progreso en todos los cursos.</p>
        <form class="cuenta-form" autocomplete="on">
          <label>Correo
            <input type="email" name="correo" required autocomplete="email">
          </label>
          <label>Contraseña
            <input type="password" name="clave" required minlength="6" autocomplete="current-password">
          </label>
          <p class="cuenta-mensaje" role="status" aria-live="polite"></p>
          <button type="submit" class="btn">Iniciar sesión</button>
        </form>
      </div>
    `;
    document.body.append(fondo);

    const modal = fondo.querySelector(".cuenta-modal");
    const titulo = fondo.querySelector(".cuenta-modal-titulo");
    const tabs = fondo.querySelectorAll('[role="tab"]');
    const form = fondo.querySelector("form");
    const btnEnviar = form.querySelector('button[type="submit"]');
    const mensaje = fondo.querySelector(".cuenta-mensaje");
    let modo = "entrar";

    function abrir() {
      fondo.hidden = false;
      mensaje.textContent = "";
      mensaje.classList.remove("es-error");
      form.reset();
      form.querySelector('input[name="correo"]').focus();
    }
    function cerrar() {
      fondo.hidden = true;
    }

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        modo = tab.dataset.modo;
        tabs.forEach((t) => t.setAttribute("aria-selected", String(t === tab)));
        titulo.textContent = modo === "entrar" ? "Inicia sesión" : "Crea tu cuenta";
        btnEnviar.textContent = modo === "entrar" ? "Iniciar sesión" : "Crear cuenta";
        form.querySelector('input[name="clave"]').autocomplete = modo === "entrar" ? "current-password" : "new-password";
        mensaje.textContent = "";
        mensaje.classList.remove("es-error");
      });
    });

    fondo.querySelector(".cuenta-modal-cerrar").addEventListener("click", cerrar);
    fondo.addEventListener("click", (e) => { if (e.target === fondo) cerrar(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !fondo.hidden) cerrar(); });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const correo = form.correo.value.trim();
      const clave = form.clave.value;
      btnEnviar.disabled = true;
      mensaje.classList.remove("es-error");
      mensaje.textContent = modo === "entrar" ? "Entrando…" : "Creando tu cuenta…";

      const resultado = modo === "entrar"
        ? await sb.auth.signInWithPassword({ email: correo, password: clave })
        : await sb.auth.signUp({ email: correo, password: clave });

      btnEnviar.disabled = false;

      if (resultado.error) {
        mensaje.classList.add("es-error");
        mensaje.textContent = textoError(resultado.error);
        return;
      }

      if (modo === "registrar" && !resultado.data.session) {
        mensaje.classList.remove("es-error");
        mensaje.textContent = "Cuenta creada. Revisa tu correo para confirmarla antes de iniciar sesión.";
        return;
      }

      cerrar();
    });

    return { abrir, cerrar, modal };
  }

  function crearBotonCuenta(header) {
    const contenedor = document.createElement("div");
    contenedor.className = "cuenta-widget";

    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "cuenta-boton";
    contenedor.append(boton);

    const menu = document.createElement("div");
    menu.className = "cuenta-menu";
    menu.hidden = true;
    menu.innerHTML = `<p class="cuenta-menu-correo"></p><button type="button" class="cuenta-menu-salir">Cerrar sesión</button>`;
    contenedor.append(menu);

    const { abrir } = crearModal();

    boton.addEventListener("click", () => {
      if (usuarioActual) {
        menu.hidden = !menu.hidden;
      } else {
        abrir();
      }
    });

    document.addEventListener("click", (e) => {
      if (!contenedor.contains(e.target)) menu.hidden = true;
    });

    menu.querySelector(".cuenta-menu-salir").addEventListener("click", async () => {
      await sb.auth.signOut();
      menu.hidden = true;
    });

    window.Cuenta.alCambiar((usuario) => {
      menu.hidden = true;
      if (usuario) {
        boton.textContent = usuario.email.length > 18 ? usuario.email.slice(0, 16) + "…" : usuario.email;
        boton.classList.add("cuenta-boton-activa");
        menu.querySelector(".cuenta-menu-correo").textContent = usuario.email;
      } else {
        boton.textContent = "Iniciar sesión";
        boton.classList.remove("cuenta-boton-activa");
      }
    });

    (header.querySelector(".header-inner") || header).append(contenedor);
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-boton-cuenta]").forEach(crearBotonCuenta);
  });
}
