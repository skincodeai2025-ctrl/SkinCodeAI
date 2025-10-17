const API = { base: '/api/citas', servicios: '/api/servicios', tatuadores: '/api/tatuadores' };

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function setPreset(type){
  const hoy = new Date();
  const toDateStr = (d)=> d.toISOString().slice(0,10);
  let desde, hasta;
  if (type === 'hoy'){
    desde = hasta = toDateStr(hoy);
  } else if (type === 'semana'){
    const first = new Date(hoy);
    const day = hoy.getDay() || 7; // lunes=1..domingo=7
    first.setDate(hoy.getDate() - (day - 1));
    desde = toDateStr(first);
    hasta = toDateStr(hoy);
  } else if (type === 'mes'){
    const first = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const last = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
    desde = toDateStr(first);
    hasta = toDateStr(last);
  }
  if (desde) document.getElementById('f_desde').value = desde;
  if (hasta) document.getElementById('f_hasta').value = hasta;
}

function limpiarFiltros(){
  document.getElementById('f_estado').value = '';
  const fs = document.getElementById('f_servicio'); if (fs) fs.value = '';
  const ft = document.getElementById('f_tatuador'); if (ft) ft.value = '';
  document.getElementById('f_desde').value = '';
  document.getElementById('f_hasta').value = '';
  state.page = 1;
  cargarCitas();
}

async function exportCSV(){
  // Volver a cargar con limit grande para exportar hasta 1000 filas de la página actual de filtros
  const estado = document.getElementById('f_estado').value || '';
  const id_servicio = document.getElementById('f_servicio')?.value || '';
  const id_usuario_tatuador = document.getElementById('f_tatuador')?.value || '';
  const fecha_desde_raw = document.getElementById('f_desde').value || '';
  const fecha_hasta_raw = document.getElementById('f_hasta').value || '';
  const fecha_desde = fecha_desde_raw ? `${fecha_desde_raw} 00:00:00` : '';
  const fecha_hasta = fecha_hasta_raw ? `${fecha_hasta_raw} 23:59:59` : '';
  const query = new URLSearchParams({ estado, id_servicio, id_usuario_tatuador, fecha_desde, fecha_hasta, limit: '1000', page: '1' });
  const res = await fetch(`${API.base}?${query.toString()}`, { headers: authHeaders() });
  const data = await res.json();
  const rows = Array.isArray(data) ? data : [];
  const headers = ['ID','Cliente','Tatuador','Servicio','Estado','Inicio','Fin','Precio'];
  const csv = [headers.join(',')].concat(rows.map(c => [
    c.id_cita,
    escapeCsv(c.cliente_nombre || c.id_usuario_cliente || ''),
    escapeCsv(c.tatuador_nombre || c.id_usuario_tatuador || ''),
    escapeCsv(c.servicio_nombre || ''),
    c.estado || '',
    c.fecha_hora_inicio || '',
    c.fecha_hora_fin || '',
    c.precio ?? ''
  ].join(','))).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'citas.csv';
  a.click();
  URL.revokeObjectURL(url);
}

function escapeCsv(val){
  const s = String(val ?? '');
  if (s.includes(',') || s.includes('"') || s.includes('\n')){
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

async function verDetalle(id) {
  const res = await fetch(`${API.base}/${id}`, { headers: authHeaders() });
  if (!res.ok) { const e = await res.json().catch(()=>({})); alert(e.error || 'No se pudo cargar la cita'); return; }
  const c = await res.json();
  document.getElementById('det_id').textContent = c.id_cita;
  document.getElementById('det_estado').textContent = c.estado;
  document.getElementById('det_servicio').textContent = c.servicio_nombre || '—';
  document.getElementById('det_precio').textContent = c.precio ?? '—';
  document.getElementById('det_cliente').textContent = c.cliente_nombre || c.id_usuario_cliente || '—';
  document.getElementById('det_tatuador').textContent = c.tatuador_nombre || c.id_usuario_tatuador || '—';
  document.getElementById('det_inicio').textContent = c.fecha_hora_inicio ?? '—';
  document.getElementById('det_fin').textContent = c.fecha_hora_fin ?? '—';
  document.getElementById('det_notas_cliente').textContent = c.notas_cliente ?? '';
  document.getElementById('det_notas_internas').textContent = c.notas_internas ?? '';
  const urlEl = document.getElementById('det_url');
  urlEl.textContent = c.url_referencia || '';
  urlEl.href = c.url_referencia || '#';
  document.getElementById('det_pago_estado').textContent = c.pago_estado ?? '—';
  document.getElementById('det_pago_monto').textContent = c.pago_monto ?? '—';
  document.getElementById('det_pago_fecha').textContent = c.pago_fecha ?? '—';
  modalDetalle ||= new bootstrap.Modal(document.getElementById('modalDetalle'));
  modalDetalle.show();
}

let modalSolicitud, modalProgramar, modalDetalle, modalCancelar, modalRealizar;
let state = { page: 1, limit: 20, lastCount: 0 };

async function cargarCitas(params = {}) {
  const merged = { page: state.page, limit: state.limit, ...params };
  const query = new URLSearchParams(Object.fromEntries(Object.entries(merged).filter(([, v]) => v !== undefined && v !== null && v !== '')));
  const res = await fetch(`${API.base}${query.toString() ? `?${query}` : ''}`, { headers: authHeaders() });
  if (res.status === 401) { alert('Sesión expirada'); window.location.href = 'login.html'; return; }
  const datos = await res.json();
  state.lastCount = Array.isArray(datos) ? datos.length : 0;
  const tbody = document.querySelector('#tabla-citas tbody');
  tbody.innerHTML = '';
  datos.forEach(c => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${c.id_cita}</td>
      <td>${c.cliente_nombre || c.id_usuario_cliente || '—'}</td>
      <td>${c.tatuador_nombre || c.id_usuario_tatuador || '—'}</td>
      <td>${c.servicio_nombre || '—'}</td>
      <td><span class="badge text-bg-secondary">${c.estado}</span></td>
      <td>${formatDateTime(c.fecha_hora_inicio)}</td>
      <td>${formatDateTime(c.fecha_hora_fin)}</td>
      <td>${c.precio ?? '—'}</td>
      <td class="actions">
        <button class="btn btn-sm btn-outline-secondary" data-id="${c.id_cita}" data-action="ver">Ver</button>
        ${c.estado === 'solicitud' ? `<button class="btn btn-sm btn-outline-primary" data-id="${c.id_cita}" data-action="programar">Programar</button>` : ''}
        ${c.estado === 'programada' ? `<button class="btn btn-sm btn-outline-success" data-id="${c.id_cita}" data-action="confirmar">Confirmar</button>` : ''}
        ${c.estado !== 'cancelada' && c.estado !== 'realizada' ? `<button class="btn btn-sm btn-outline-danger" data-id="${c.id_cita}" data-action="cancelar">Cancelar</button>` : ''}
        ${c.estado === 'confirmada' ? `<button class="btn btn-sm btn-outline-dark" data-id="${c.id_cita}" data-action="realizar">Realizar</button>` : ''}
      </td>`;
    tbody.appendChild(tr);
  });
  if (state.lastCount === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td colspan="9" class="text-center text-muted">Sin resultados</td>';
    tbody.appendChild(tr);
  }
  tbody.addEventListener('click', onActionClick);
  updatePaginationUI();
}

function aplicarFiltros(e) {
  e.preventDefault();
  const estado = document.getElementById('f_estado').value;
  const id_servicio = document.getElementById('f_servicio').value || null;
  const id_usuario_tatuador = document.getElementById('f_tatuador').value || null;
  const fecha_desde_raw = document.getElementById('f_desde').value || null;
  const fecha_hasta_raw = document.getElementById('f_hasta').value || null;
  if (fecha_desde_raw && fecha_hasta_raw && fecha_desde_raw > fecha_hasta_raw) {
    alert('La fecha Desde no puede ser mayor que Hasta');
    return false;
  }
  const fecha_desde = fecha_desde_raw ? `${fecha_desde_raw} 00:00:00` : null;
  const fecha_hasta = fecha_hasta_raw ? `${fecha_hasta_raw} 23:59:59` : null;
  state.page = 1;
  cargarCitas({ estado, id_servicio, id_usuario_tatuador, fecha_desde, fecha_hasta });
  return false;
}

function abrirNuevaSolicitud() {
  modalSolicitud ||= new bootstrap.Modal(document.getElementById('modalSolicitud'));
  modalSolicitud.show();
}

async function onActionClick(e) {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;
  const id = btn.getAttribute('data-id');
  const action = btn.getAttribute('data-action');
  if (action === 'programar') return abrirProgramar(id);
  if (action === 'confirmar') return confirmar(id);
  if (action === 'cancelar') return abrirCancelar(id);
  if (action === 'realizar') return abrirRealizar(id);
  if (action === 'ver') return verDetalle(id);
}

async function abrirProgramar(id) {
  document.getElementById('prog_id_cita').value = id;
  modalProgramar ||= new bootstrap.Modal(document.getElementById('modalProgramar'));
  modalProgramar.show();
}

async function confirmar(id) {
  const res = await fetch(`${API.base}/${id}/confirmar`, { method: 'PUT', headers: authHeaders() });
  if (res.ok) { cargarCitas(); } else { const e = await res.json(); alert(e.error || 'Error'); }
}

function abrirCancelar(id){
  document.getElementById('cancel_id').value = id;
  document.getElementById('cancel_nota').value = '';
  modalCancelar ||= new bootstrap.Modal(document.getElementById('modalCancelar'));
  modalCancelar.show();
}

function abrirRealizar(id){
  document.getElementById('real_id').value = id;
  document.getElementById('real_monto').value = '';
  document.getElementById('real_fecha').value = '';
  modalRealizar ||= new bootstrap.Modal(document.getElementById('modalRealizar'));
  modalRealizar.show();
}

async function cargarServicios() {
  const res = await fetch(API.servicios, { headers: authHeaders() });
  if (!res.ok) return;
  const lista = await res.json();
  const sel = document.getElementById('sol_id_servicio');
  sel.innerHTML = '<option value="">(Opcional)</option>' + lista.map(s => `<option value="${s.id_servicio}">${s.nombre}</option>`).join('');
}

async function cargarTatuadores() {
  const res = await fetch(API.tatuadores, { headers: authHeaders() });
  if (!res.ok) return;
  const lista = await res.json();
  const sel = document.getElementById('prog_id_tatuador');
  sel.innerHTML = '<option value="" disabled selected>Selecciona...</option>' + lista.map(t => `<option value="${t.id_usuario}">${t.nombre_artistico}</option>`).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  const formSol = document.getElementById('formSolicitud');
  const formProg = document.getElementById('formProgramar');

  formSol.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id_servicio = document.getElementById('sol_id_servicio').value || null;
    const notas_cliente = document.getElementById('sol_notas_cliente').value || null;
    const url_referencia = document.getElementById('sol_url_ref').value || null;
    const res = await fetch(API.base, { method: 'POST', headers: { ...authHeaders(), 'Content-Type': 'application/json' }, body: JSON.stringify({ id_servicio, notas_cliente, url_referencia }) });
    if (res.ok) { modalSolicitud.hide(); formSol.reset(); cargarCitas(); } else { const er = await res.json(); alert(er.error || 'Error'); }
  });

  formProg.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('prog_id_cita').value;
    const id_usuario_tatuador = document.getElementById('prog_id_tatuador').value;
    const inicio = document.getElementById('prog_inicio').value;
    const fin = document.getElementById('prog_fin').value;
    const precio = document.getElementById('prog_precio').value || null;
    const res = await fetch(`${API.base}/${id}/programar`, { method: 'PUT', headers: { ...authHeaders(), 'Content-Type': 'application/json' }, body: JSON.stringify({ id_usuario_tatuador, fecha_hora_inicio: toMysqlDatetime(inicio), fecha_hora_fin: toMysqlDatetime(fin), precio }) });
    if (res.ok) { modalProgramar.hide(); formProg.reset(); cargarCitas(); } else { const er = await res.json(); alert(er.error || 'Error'); }
  });

  const formCancel = document.getElementById('formCancelar');
  formCancel.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const id = document.getElementById('cancel_id').value;
    const notas_internas = document.getElementById('cancel_nota').value;
    const res = await fetch(`${API.base}/${id}/cancelar`, { method:'PUT', headers:{...authHeaders(), 'Content-Type':'application/json'}, body: JSON.stringify({ notas_internas })});
    if (res.ok) { modalCancelar.hide(); formCancel.reset(); cargarCitas(); } else { const er = await res.json(); alert(er.error||'Error'); }
  });

  const formReal = document.getElementById('formRealizar');
  formReal.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const id = document.getElementById('real_id').value;
    const pago_monto = document.getElementById('real_monto').value;
    const pago_fecha = document.getElementById('real_fecha').value ? toMysqlDatetime(document.getElementById('real_fecha').value) : null;
    const res = await fetch(`${API.base}/${id}/realizar`, { method:'PUT', headers:{...authHeaders(), 'Content-Type':'application/json'}, body: JSON.stringify({ pago_monto, pago_fecha })});
    if (res.ok) { modalRealizar.hide(); formReal.reset(); cargarCitas(); } else { const er = await res.json(); alert(er.error||'Error'); }
  });

  cargarServicios();
  // Poblado de select de filtro servicio (reutilizamos lista de servicios)
  (async ()=>{
    const res = await fetch(API.servicios, { headers: authHeaders() });
    if (res.ok) {
      const lista = await res.json();
      const sel = document.getElementById('f_servicio');
      if (sel) sel.innerHTML = '<option value="">Todos</option>' + lista.map(s => `<option value="${s.id_servicio}">${s.nombre}</option>`).join('');
    }
  })();
  // Poblado de filtro tatuador
  (async ()=>{
    const res = await fetch(API.tatuadores, { headers: authHeaders() });
    if (res.ok) {
      const lista = await res.json();
      const sel = document.getElementById('f_tatuador');
      if (sel) sel.innerHTML = '<option value="">Todos</option>' + lista.map(t => `<option value="${t.id_usuario}">${t.nombre_artistico}</option>`).join('');
    }
  })();
  cargarTatuadores();
  // Paginación UI
  document.getElementById('page_size').addEventListener('change', (e)=>{
    state.limit = parseInt(e.target.value) || 20;
    state.page = 1;
    cargarCitas();
  });
  document.getElementById('btn_prev').addEventListener('click', ()=>{
    if (state.page > 1) { state.page--; cargarCitas(); }
  });
  document.getElementById('btn_next').addEventListener('click', ()=>{
    // Si recibimos menos que el límite, probablemente no haya más páginas
    if (state.lastCount === state.limit) { state.page++; cargarCitas(); }
  });
  document.getElementById('btn_export').addEventListener('click', exportCSV);
  // Date presets
  const btnHoy = document.getElementById('btn_hoy');
  const btnSemana = document.getElementById('btn_semana');
  const btnMes = document.getElementById('btn_mes');
  if (btnHoy) btnHoy.addEventListener('click', ()=> setPreset('hoy'));
  if (btnSemana) btnSemana.addEventListener('click', ()=> setPreset('semana'));
  if (btnMes) btnMes.addEventListener('click', ()=> setPreset('mes'));
  cargarCitas();
});

function toMysqlDatetime(local) {
  if (!local) return null;
  return local.replace('T', ' ') + ':00';
}

function formatDateTime(dt){
  if (!dt) return '—';
  try {
    // dt de MySQL viene como 'YYYY-MM-DD HH:MM:SS'
    const iso = dt.replace(' ', 'T');
    const d = new Date(iso);
    if (isNaN(d.getTime())) return dt;
    return d.toLocaleString();
  } catch { return dt; }
}

function updatePaginationUI(){
  const info = document.getElementById('page_info');
  const prev = document.getElementById('btn_prev');
  const next = document.getElementById('btn_next');
  if (info) info.textContent = `Página ${state.page}`;
  if (prev) prev.disabled = state.page <= 1;
  if (next) next.disabled = state.lastCount < state.limit; // deshabilitar si no hay más
}
