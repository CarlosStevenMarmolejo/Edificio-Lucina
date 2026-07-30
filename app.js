// app.js — Edificio Lucina, administración de propiedad horizontal
// Vanilla JS, sin frameworks. Los datos viven en Firestore (ver firebase-init.js).

const DOC_PATH = { collection: "edificio", id: "lucina" };
const PEPPER = "edificio-lucina-2026";

let STATE = {
  data: null,
  role: null,        // null | 'admin' | 'owner'
  unitId: null,       // unidad activa cuando role === 'owner'
  tab: "resumen",      // pestaña activa del panel admin
  loginUnit: "",       // unidad seleccionada en la pantalla de login (propietario)
};

let chartInstance = null;

// ---------- Utilidades ----------

const $ = (id) => document.getElementById(id);

function fmt(n) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })
    .format(Math.round(n || 0));
}

async function hashPassword(password) {
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest("SHA-256", enc.encode(PEPPER + ":" + password));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function monthLabel(key) {
  const m = MONTHS.find(([k]) => k === key);
  return m ? m[1] : key;
}

// ---------- Persistencia (Firestore) ----------

async function loadData() {
  const ref = db.collection(DOC_PATH.collection).doc(DOC_PATH.id);
  const snap = await ref.get();
  if (snap.exists) {
    const data = snap.data();
    if (!data.auth) data.auth = seedAuth();
    return data;
  }
  const seed = seedData();
  await ref.set(seed);
  return seed;
}

async function saveData(data) {
  await db.collection(DOC_PATH.collection).doc(DOC_PATH.id).set(data);
}

async function updateData(mutator) {
  const next = mutator(STATE.data);
  STATE.data = next;
  await saveData(next);
  render();
}

// ---------- Init ----------

async function init() {
  render(); // loading state
  try {
    STATE.data = await loadData();
  } catch (e) {
    $("app").innerHTML = `<div class="loading">
      No se pudo conectar con la base de datos.<br>
      Revisa que <code>firebase-init.js</code> tenga tus credenciales reales de Firebase.
      <br><br><span style="color:#8B2E2E">${e.message || e}</span>
    </div>`;
    return;
  }
  render();
}

// ---------- Render dispatcher ----------

function render() {
  const app = $("app");
  if (!STATE.data) {
    app.innerHTML = `<div class="loading">Cargando datos del edificio…</div>`;
    return;
  }
  if (!STATE.role) return renderLogin();
  if (STATE.role === "owner") return renderOwner();
  if (STATE.role === "admin") return renderAdmin();
}

// ---------- Login ----------

function renderLogin() {
  const data = STATE.data;
  const adminNeedsSetup = !data.auth.adminHash;

  const unit = data.units.find((u) => u.id === STATE.loginUnit);
  const ownerNeedsSetup = unit && !data.auth.units[unit.id];

  $("app").innerHTML = `
    <div class="login-wrap">
      <div class="login-header">
        <img class="login-logo" src="assets/Logo.png" alt="Logo Edificio Lucina">
        <div class="login-title">Administración del edificio</div>
        <div class="login-sub">Cuotas, gastos y reportes en un solo lugar</div>
      </div>

      <div class="auth-card">
        <h3>Soy administrador</h3>
        <p class="hint">${adminNeedsSetup
          ? "Primera vez: crea tu contraseña de administrador."
          : "Gestiona cuotas, cuota extra, gastos y reportes del edificio."}</p>
        <input class="w-full" type="password" id="admin-pw" placeholder="${adminNeedsSetup ? "Crea una contraseña" : "Contraseña"}">
        ${adminNeedsSetup ? `<input class="w-full" type="password" id="admin-pw2" placeholder="Confirma la contraseña">` : ""}
        <div class="auth-error" id="admin-error"></div>
        <button class="btn-block btn-primary" data-action="admin-login-submit">
          ${adminNeedsSetup ? "Crear contraseña y entrar" : "Ingresar como administrador"}
        </button>
      </div>

      <div class="auth-card">
        <h3>Soy propietario</h3>
        <p class="hint">Consulta el estado de cuenta de tu apartamento o local.</p>
        <select class="w-full" id="owner-unit-select" data-action="owner-unit-change">
          <option value="">Selecciona tu unidad…</option>
          ${data.units.map((u) => `<option value="${u.id}" ${u.id === STATE.loginUnit ? "selected" : ""}>${u.nombre} — ${u.propietario}</option>`).join("")}
        </select>
        ${STATE.loginUnit ? `
          <p class="hint" style="margin-top:-2px;">${ownerNeedsSetup ? "Primera vez: crea tu contraseña." : "Ingresa tu contraseña."}</p>
          <input class="w-full" type="password" id="owner-pw" placeholder="${ownerNeedsSetup ? "Crea una contraseña" : "Contraseña"}">
          ${ownerNeedsSetup ? `<input class="w-full" type="password" id="owner-pw2" placeholder="Confirma la contraseña">` : ""}
        ` : ""}
        <div class="auth-error" id="owner-error"></div>
        <button class="btn-block btn-primary" data-action="owner-login-submit" ${!STATE.loginUnit ? "disabled" : ""}>
          ${ownerNeedsSetup ? "Crear contraseña y entrar" : "Ver mi estado de cuenta"}
        </button>
      </div>
    </div>
  `;
}

async function handleAdminLogin() {
  const data = STATE.data;
  const needsSetup = !data.auth.adminHash;
  const pw = $("admin-pw").value;
  const errorEl = $("admin-error");
  errorEl.textContent = "";

  if (needsSetup) {
    const pw2 = $("admin-pw2").value;
    if (pw.length < 4) return (errorEl.textContent = "La contraseña debe tener al menos 4 caracteres.");
    if (pw !== pw2) return (errorEl.textContent = "Las contraseñas no coinciden.");
    const hash = await hashPassword(pw);
    await updateData((d) => ({ ...d, auth: { ...d.auth, adminHash: hash } }));
    STATE.role = "admin";
    STATE.tab = "resumen";
    render();
  } else {
    const hash = await hashPassword(pw);
    if (hash === data.auth.adminHash) {
      STATE.role = "admin";
      STATE.tab = "resumen";
      render();
    } else {
      errorEl.textContent = "Contraseña incorrecta.";
    }
  }
}

async function handleOwnerLogin() {
  const data = STATE.data;
  const unit = data.units.find((u) => u.id === STATE.loginUnit);
  const errorEl = $("owner-error");
  errorEl.textContent = "";
  if (!unit) return (errorEl.textContent = "Selecciona tu unidad primero.");

  const needsSetup = !data.auth.units[unit.id];
  const pw = $("owner-pw").value;

  if (needsSetup) {
    const pw2 = $("owner-pw2").value;
    if (pw.length < 4) return (errorEl.textContent = "La contraseña debe tener al menos 4 caracteres.");
    if (pw !== pw2) return (errorEl.textContent = "Las contraseñas no coinciden.");
    const hash = await hashPassword(pw);
    await updateData((d) => ({ ...d, auth: { ...d.auth, units: { ...d.auth.units, [unit.id]: hash } } }));
    STATE.role = "owner";
    STATE.unitId = unit.id;
    render();
  } else {
    const hash = await hashPassword(pw);
    if (hash === data.auth.units[unit.id]) {
      STATE.role = "owner";
      STATE.unitId = unit.id;
      render();
    } else {
      errorEl.textContent = "Contraseña incorrecta.";
    }
  }
}

// ---------- Vista propietario ----------

function renderOwner() {
  const unit = STATE.data.units.find((u) => u.id === STATE.unitId);
  const totalPagado = MONTHS.reduce((s, [k]) => s + (unit.pagos[k] || 0), 0);
  const totalEsperado = unit.valorMensual * 6 + (unit.deudaPrevia || 0);
  const saldoCuotas = Math.max(totalEsperado - totalPagado, 0);
  const saldoExtra = unit.cuotaExtraDebe - unit.cuotaExtraAbonado;

  const rows = MONTHS.map(([k, label]) => {
    const val = unit.pagos[k] || 0;
    const paid = val >= unit.valorMensual * 0.95;
    const pillHTML = paid
      ? `<span class="pill pill-ok">Pagado</span>`
      : val > 0
      ? `<span class="pill pill-pending">Parcial</span>`
      : `<span class="pill pill-debt">Sin pago</span>`;
    return `<tr><td>${label}</td><td>${fmt(val)}</td><td>${pillHTML}</td></tr>`;
  }).join("");

  $("app").innerHTML = `
    <div class="page-wrap owner">
      <div class="top-row">
        <div>
          <div class="page-title">${unit.nombre}</div>
          <div style="color:var(--muted); font-size:13px;">${unit.propietario}</div>
        </div>
        <button data-action="logout">Cerrar sesión</button>
      </div>

      <div class="cards-row">
        ${metricCard("Cuota mensual", fmt(unit.valorMensual))}
        ${metricCard("Saldo cuotas admin", fmt(saldoCuotas), null, saldoCuotas > 0 ? "danger" : "good")}
        ${metricCard("Saldo cuota extra", fmt(saldoExtra), null, saldoExtra > 0 ? "danger" : "good")}
      </div>

      <div style="font-size:14px; font-weight:700; margin-bottom:10px;">Historial de pagos (cuota de administración)</div>
      <div class="table-wrap" style="margin-bottom:24px;">
        <table>
          <thead><tr><th>Mes</th><th>Pagado</th><th>Estado</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>

      <div style="font-size:14px; font-weight:700; margin-bottom:10px;">Cuota extra</div>
      <div class="balance-box">
        <div class="balance-line"><span class="balance-label">Debe</span><span class="balance-value">${fmt(unit.cuotaExtraDebe)}</span></div>
        <div class="balance-line"><span class="balance-label">Abonado</span><span class="balance-value">${fmt(unit.cuotaExtraAbonado)}</span></div>
        <div class="balance-line"><span class="balance-label">Saldo</span><span class="balance-value" style="color:${saldoExtra > 0 ? "var(--red)" : "var(--green)"}">${fmt(saldoExtra)}</span></div>
      </div>
    </div>
  `;
}

function metricCard(label, value, sub, tone) {
  return `
    <div class="metric-card">
      <div class="metric-label">${label}</div>
      <div class="metric-value ${tone || ""}">${value}</div>
      ${sub ? `<div class="metric-sub">${sub}</div>` : ""}
    </div>
  `;
}

// ---------- Panel administrador ----------

function renderAdmin() {
  const tabs = [
    ["resumen", "Resumen"], ["cuotas", "Cuotas"], ["extra", "Cuota extra"],
    ["gastos", "Gastos"], ["consolidado", "Consolidado"], ["seguridad", "Seguridad"],
  ];

  $("app").innerHTML = `
    <div class="page-wrap">
      <div class="top-row">
        <div class="brand-row">
          <img src="assets/Logo.png" alt="Logo">
          <div class="page-title">Panel de administración</div>
        </div>
        <button data-action="logout">Cerrar sesión</button>
      </div>
      <div class="tabs">
        ${tabs.map(([k, l]) => `<button class="tab-btn ${STATE.tab === k ? "active" : ""}" data-action="tab" data-tab="${k}">${l}</button>`).join("")}
      </div>
      <div id="tab-content"></div>
    </div>
  `;

  const content = $("tab-content");
  if (STATE.tab === "resumen") content.innerHTML = renderResumen();
  if (STATE.tab === "cuotas") content.innerHTML = renderCuotas();
  if (STATE.tab === "extra") content.innerHTML = renderExtra();
  if (STATE.tab === "gastos") content.innerHTML = renderGastos();
  if (STATE.tab === "consolidado") { content.innerHTML = renderConsolidado(); mountChart(); }
  if (STATE.tab === "seguridad") content.innerHTML = renderSeguridad();
}

function renderResumen() {
  const { units, gastos } = STATE.data;
  const totalRecaudado = units.reduce((s, u) => s + MONTHS.reduce((s2, [k]) => s2 + (u.pagos[k] || 0), 0), 0);
  const totalCuotasEsperadas = units.reduce((s, u) => s + u.valorMensual * 6, 0);
  const totalGastos = gastos.reduce((s, g) => s + g.valor, 0);
  const cartera = units.reduce((s, u) => {
    const pagado = MONTHS.reduce((s2, [k]) => s2 + (u.pagos[k] || 0), 0);
    const esperado = u.valorMensual * 6 + (u.deudaPrevia || 0);
    return s + Math.max(esperado - pagado, 0);
  }, 0);
  const extraDebe = units.reduce((s, u) => s + u.cuotaExtraDebe, 0);
  const extraAbonado = units.reduce((s, u) => s + u.cuotaExtraAbonado, 0);

  return `
    <div class="cards-row">
      ${metricCard("Recaudado (cuotas)", fmt(totalRecaudado), `de ${fmt(totalCuotasEsperadas)} esperado`, "good")}
      ${metricCard("Gastos registrados", fmt(totalGastos))}
      ${metricCard("Cartera pendiente", fmt(cartera), null, cartera > 0 ? "danger" : "good")}
      ${metricCard("Cuota extra", fmt(extraAbonado), `de ${fmt(extraDebe)} por recoger`)}
    </div>
    <div style="font-size:13px; color:var(--muted);">
      Datos cargados desde el archivo original (enero a junio). Edita pagos y gastos en las pestañas de arriba.
    </div>
  `;
}

function renderCuotas() {
  const { units } = STATE.data;
  const rows = units.map((u) => {
    const cells = MONTHS.map(([k]) => {
      const val = u.pagos[k] || 0;
      const paid = val >= u.valorMensual * 0.95;
      const cls = paid ? "paid" : val > 0 ? "partial" : "unpaid";
      return `<td style="padding:2px;"><input type="number" class="cell-input ${cls}" value="${val}"
        data-role="pago" data-unit="${u.id}" data-month="${k}"></td>`;
    }).join("");
    return `<tr>
      <td class="strong" style="white-space:nowrap;">${u.nombre}</td>
      <td class="muted">${u.propietario}</td>
      <td>${fmt(u.valorMensual)}</td>
      ${cells}
    </tr>`;
  }).join("");

  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Unidad</th><th>Propietario</th><th>Cuota mensual</th>
            ${MONTHS.map(([k, l]) => `<th>${l.slice(0, 3)}</th>`).join("")}
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function renderExtra() {
  const { units } = STATE.data;
  const totalDebe = units.reduce((s, u) => s + u.cuotaExtraDebe, 0);
  const totalAbonado = units.reduce((s, u) => s + u.cuotaExtraAbonado, 0);

  const rows = units.map((u) => {
    const saldo = u.cuotaExtraDebe - u.cuotaExtraAbonado;
    return `<tr>
      <td class="strong">${u.nombre}</td>
      <td class="muted">${u.propietario}</td>
      <td>${fmt(u.cuotaExtraDebe)}</td>
      <td><input type="number" class="cell-input" style="width:90px;" value="${u.cuotaExtraAbonado}"
        data-role="extra-abonado" data-unit="${u.id}"></td>
      <td>${fmt(saldo)}</td>
      <td>${saldo <= 0 ? `<span class="pill pill-ok">Al día</span>` : `<span class="pill pill-debt">Pendiente</span>`}</td>
    </tr>`;
  }).join("");

  return `
    <div class="cards-row">
      ${metricCard("Total a recoger", fmt(totalDebe))}
      ${metricCard("Total abonado", fmt(totalAbonado), null, "good")}
      ${metricCard("Falta por recoger", fmt(totalDebe - totalAbonado), null, totalDebe - totalAbonado > 0 ? "danger" : "good")}
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Unidad</th><th>Propietario</th><th>Debe</th><th>Abonado</th><th>Saldo</th><th>Estado</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <div class="note">Nota: los valores de "abonado" iniciales se estimaron a partir del archivo original; revísalos y ajústalos si es necesario.</div>
  `;
}

function renderGastos(filterMes) {
  filterMes = filterMes || STATE.gastosFilter || "todos";
  STATE.gastosFilter = filterMes;
  const { gastos } = STATE.data;
  const shown = filterMes === "todos" ? gastos : gastos.filter((g) => g.mes === filterMes);
  const total = shown.reduce((s, g) => s + g.valor, 0);

  const rows = shown.map((g) => `
    <tr>
      <td>${monthLabel(g.mes)}</td>
      <td>${g.concepto}</td>
      <td><span style="color:${CAT_COLOR[g.categoria]}; font-weight:600;">${g.categoria}</span></td>
      <td>${fmt(g.valor)}</td>
      <td>${g.metodoPago}</td>
      <td>${g.cuenta}</td>
      <td>${g.estado === "OK" ? `<span class="pill pill-ok">OK</span>` : `<span class="pill pill-pending">Pendiente</span>`}</td>
      <td><button data-action="remove-gasto" data-id="${g.id}" style="font-size:11px;">Eliminar</button></td>
    </tr>
  `).join("");

  return `
    <div class="form-card">
      <h4>Registrar gasto</h4>
      <div class="form-row">
        <select id="g-mes">${MONTHS.map(([k, l]) => `<option value="${k}">${l}</option>`).join("")}</select>
        <input type="text" id="g-concepto" placeholder="Concepto (ej. Empresa de aseo)">
        <select id="g-categoria">${CATEGORIAS.map((c) => `<option value="${c}">${c}</option>`).join("")}</select>
        <input type="number" id="g-valor" placeholder="Valor" style="width:110px; flex:0 0 110px;">
        <select id="g-metodo"><option>TRANSFERENCIA</option><option>EFECTIVO</option></select>
        <select id="g-cuenta"><option>Cuenta de ahorros</option><option>Plan Semilla</option></select>
        <select id="g-estado"><option>OK</option><option>PENDIENTE</option></select>
        <button class="btn-primary" data-action="add-gasto">Agregar</button>
      </div>
    </div>

    <div class="list-toolbar">
      <select data-action="filter-gastos">
        <option value="todos" ${filterMes === "todos" ? "selected" : ""}>Todos los meses</option>
        ${MONTHS.map(([k, l]) => `<option value="${k}" ${filterMes === k ? "selected" : ""}>${l}</option>`).join("")}
      </select>
      <div style="font-weight:700;">Total: ${fmt(total)}</div>
    </div>

    <div class="table-wrap">
      <table>
        <thead><tr><th>Mes</th><th>Concepto</th><th>Categoría</th><th>Valor</th><th>Método</th><th>Cuenta</th><th>Estado</th><th></th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function renderConsolidado() {
  const rows = CATEGORIAS.map((c) => {
    const vals = MONTHS.map(([k]) => STATE.data.gastos.filter((g) => g.mes === k && g.categoria === c).reduce((s, g) => s + g.valor, 0));
    const total = vals.reduce((a, b) => a + b, 0);
    return `<tr>
      <td class="strong" style="color:${CAT_COLOR[c]}">${c}</td>
      ${vals.map((v) => `<td>${v ? fmt(v) : "-"}</td>`).join("")}
      <td class="strong">${fmt(total)}</td>
    </tr>`;
  }).join("");

  return `
    <div class="legend-row">
      ${CATEGORIAS.map((c) => `<span><span class="legend-dot" style="background:${CAT_COLOR[c]}"></span>${c}</span>`).join("")}
    </div>
    <div class="chart-wrap">
      <canvas id="consolidado-chart" role="img" aria-label="Gastos mensuales por categoría"></canvas>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Categoría</th>${MONTHS.map(([k, l]) => `<th>${l.slice(0, 3)}</th>`).join("")}<th>Total</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function mountChart() {
  const ctx = $("consolidado-chart");
  if (!ctx) return;
  if (chartInstance) chartInstance.destroy();
  const labels = MONTHS.map(([, l]) => l.slice(0, 3));
  const datasets = CATEGORIAS.map((c) => ({
    label: c,
    data: MONTHS.map(([k]) => STATE.data.gastos.filter((g) => g.mes === k && g.categoria === c).reduce((s, g) => s + g.valor, 0)),
    backgroundColor: CAT_COLOR[c],
  }));
  chartInstance = new Chart(ctx, {
    type: "bar",
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: (item) => `${item.dataset.label}: ${fmt(item.raw)}` } } },
      scales: { x: { stacked: true }, y: { stacked: true, ticks: { callback: (v) => (v / 1000000).toFixed(1) + "M" } } },
    },
  });
}

function renderSeguridad() {
  const { units, auth } = STATE.data;
  const rows = units.map((u) => {
    const hasPw = !!auth.units[u.id];
    return `<tr>
      <td class="strong">${u.nombre}</td>
      <td class="muted">${u.propietario}</td>
      <td>${hasPw ? `<span class="pill pill-ok">Configurada</span>` : `<span class="pill pill-pending">Sin definir</span>`}</td>
      <td>${hasPw ? `<button data-action="reset-unit-pw" data-unit="${u.id}" style="font-size:11px;">Restablecer</button>` : ""}</td>
    </tr>`;
  }).join("");

  return `
    <div class="form-card" style="max-width:420px;">
      <h4>Cambiar tu contraseña de administrador</h4>
      <input class="w-full" type="password" id="new-admin-pw" placeholder="Nueva contraseña">
      <button class="btn-primary" data-action="change-admin-pw">Actualizar contraseña</button>
      <div class="auth-ok" id="admin-pw-msg"></div>
    </div>
    <div style="font-size:14px; font-weight:700; margin-bottom:10px;">Contraseñas de propietarios</div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Unidad</th><th>Propietario</th><th>Estado</th><th></th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

// ---------- Delegación de eventos ----------

document.addEventListener("click", async (e) => {
  const el = e.target.closest("[data-action]");
  if (!el) return;
  const action = el.dataset.action;

  if (action === "admin-login-submit") return handleAdminLogin();
  if (action === "owner-login-submit") return handleOwnerLogin();

  if (action === "logout") {
    STATE.role = null;
    STATE.unitId = null;
    STATE.loginUnit = "";
    STATE.tab = "resumen";
    return render();
  }

  if (action === "tab") {
    STATE.tab = el.dataset.tab;
    return renderAdmin();
  }

  if (action === "add-gasto") {
    const concepto = $("g-concepto").value.trim();
    const valor = parseFloat($("g-valor").value);
    if (!concepto || !valor) return;
    const nuevo = {
      id: "g" + Date.now(),
      mes: $("g-mes").value,
      concepto,
      categoria: $("g-categoria").value,
      valor,
      metodoPago: $("g-metodo").value,
      cuenta: $("g-cuenta").value,
      estado: $("g-estado").value,
    };
    return updateData((d) => ({ ...d, gastos: [...d.gastos, nuevo] }));
  }

  if (action === "remove-gasto") {
    const id = el.dataset.id;
    return updateData((d) => ({ ...d, gastos: d.gastos.filter((g) => g.id !== id) }));
  }

  if (action === "change-admin-pw") {
    const pw = $("new-admin-pw").value;
    if (pw.length < 4) return;
    const hash = await hashPassword(pw);
    await updateData((d) => ({ ...d, auth: { ...d.auth, adminHash: hash } }));
    return;
  }

  if (action === "reset-unit-pw") {
    const unitId = el.dataset.unit;
    return updateData((d) => ({ ...d, auth: { ...d.auth, units: { ...d.auth.units, [unitId]: null } } }));
  }
});

document.addEventListener("change", async (e) => {
  const el = e.target;

  if (el.dataset.action === "owner-unit-change") {
    STATE.loginUnit = el.value;
    return renderLogin();
  }

  if (el.dataset.action === "filter-gastos") {
    STATE.gastosFilter = el.value;
    return ($("tab-content").innerHTML = renderGastos(el.value));
  }

  if (el.dataset.role === "pago") {
    const unitId = el.dataset.unit;
    const month = el.dataset.month;
    const value = parseFloat(el.value) || 0;
    return updateData((d) => ({
      ...d,
      units: d.units.map((u) => (u.id === unitId ? { ...u, pagos: { ...u.pagos, [month]: value } } : u)),
    }));
  }

  if (el.dataset.role === "extra-abonado") {
    const unitId = el.dataset.unit;
    const value = parseFloat(el.value) || 0;
    return updateData((d) => ({
      ...d,
      units: d.units.map((u) => (u.id === unitId ? { ...u, cuotaExtraAbonado: value } : u)),
    }));
  }
});

init();