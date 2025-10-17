// public/js/pagos.js
(async function(){
  const tatuadorSelect = document.getElementById('r_tatuador');
  try{
    const r = await fetch('/api/tatuadores', { headers: authHeaders() });
    const data = r.ok ? await r.json() : [];
    (data||[]).forEach(t=>{
      const o = document.createElement('option');
      o.value = t.id_usuario;
      o.textContent = t.nombre_artistico || t.nombre_real || t.id_usuario;
      tatuadorSelect.appendChild(o);
    });
  }catch{}

  document.getElementById('formPago').addEventListener('submit', async (e)=>{
    e.preventDefault();
    const id_cita = Number(document.getElementById('p_id_cita').value);
    const monto = Number(document.getElementById('p_monto').value);
    const metodo = document.getElementById('p_metodo').value;
    const referencia = document.getElementById('p_referencia').value.trim();
    const fechaRaw = document.getElementById('p_fecha').value;
    const fecha = fechaRaw ? fechaRaw.replace('T',' ')+':00' : '';
    const btn = e.target.querySelector('button[type="submit"]');
    const original = btn.innerHTML; btn.disabled = true; btn.innerHTML = 'Registrando…';
    try{
      const res = await fetch('/api/pagos', {
        method: 'POST', headers: { 'Content-Type':'application/json', ...authHeaders() },
        body: JSON.stringify({ id_cita, monto, metodo, fecha, referencia })
      });
      const data = await res.json();
      const alert = document.getElementById('p_alert');
      if (res.ok){
        alert.innerHTML = '<div class="alert alert-success">Pago registrado.</div>';
        e.target.reset();
      } else {
        alert.innerHTML = `<div class="alert alert-danger">${data.error||'Error al registrar pago'}</div>`;
      }
    }catch(err){
      document.getElementById('p_alert').innerHTML = '<div class="alert alert-danger">Error de red</div>';
    }finally{ btn.disabled = false; btn.innerHTML = original; }
  });

  async function cargarReporte(){
    const desdeRaw = document.getElementById('r_desde').value;
    const hastaRaw = document.getElementById('r_hasta').value;
    const granularity = document.getElementById('r_granularity').value;
    const id_usuario_tatuador = document.getElementById('r_tatuador').value;
    const desde = desdeRaw ? `${desdeRaw} 00:00:00` : '';
    const hasta = hastaRaw ? `${hastaRaw} 23:59:59` : '';

    const params = new URLSearchParams({ desde, hasta, granularity, id_usuario_tatuador });
    const res = await fetch(`/api/pagos/report?${params.toString()}`, { headers: authHeaders() });
    const data = res.ok ? await res.json() : [];
    const body = document.getElementById('reportBody');
    const fmtMoney = (n)=> new Intl.NumberFormat(undefined,{style:'currency', currency:'USD'}).format(Number(n||0));
    let total = 0; let count = 0;
    const rows = (data||[]).map(r=>{ total += Number(r.total||0); count += Number(r.pagos||0);
      return `<tr><td>${r.periodo}</td><td>${r.pagos}</td><td>${fmtMoney(r.total)}</td></tr>`; }).join('');
    body.innerHTML = rows || '<tr><td colspan="3" class="text-center text-muted">Sin datos</td></tr>';
    document.getElementById('r_total').textContent = `Pagos: ${count} | Total: ${fmtMoney(total)}`;
  }
  document.getElementById('formReport').addEventListener('submit', (e)=>{ e.preventDefault(); cargarReporte(); });
  cargarReporte();
})();
