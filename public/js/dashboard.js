// public/js/dashboard.js - Dashboard diferenciado por rol
(function(){
  const token = localStorage.getItem('token');
  if (!token) { window.location.href = 'login.html'; return; }
  const role = (localStorage.getItem('role') || 'cliente').toLowerCase();

  const roleBadge = document.getElementById('roleBadge');
  if (roleBadge) roleBadge.textContent = role;

  // Cargar nombre del usuario
  async function loadUserName() {
    try {
      const res = await fetch('/api/perfil', { headers: authHeaders() });
      if (res.ok) {
        const perfil = await res.json();
        const userNameEl = document.getElementById('userName');
        if (userNameEl && perfil.nombre_completo) {
          userNameEl.textContent = perfil.nombre_completo;
        } else if (userNameEl && perfil.email) {
          userNameEl.textContent = perfil.email.split('@')[0];
        }
      }
    } catch (err) {
      console.error('Error al cargar nombre de usuario:', err);
    }
  }
  loadUserName();

  // Actualizar reloj en tiempo real
  function updateClock() {
    const now = new Date();
    const dateEl = document.getElementById('currentDate');
    const timeEl = document.getElementById('currentTime');
    if (dateEl) dateEl.textContent = now.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    if (timeEl) timeEl.textContent = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }
  updateClock();
  setInterval(updateClock, 1000);

  // Personalizar mensaje de bienvenida
  const welcomeMessages = {
    cliente: {
      title: '¡Hola! Bienvenido a tu panel',
      subtitle: 'Gestiona tus citas y tatuajes fácilmente'
    },
    tatuador: {
      title: 'Panel del Artista',
      subtitle: 'Gestiona tu agenda, clientes y pagos'
    },
    soporte: {
      title: 'Panel de Administración',
      subtitle: 'Vista completa del sistema'
    }
  };
  const welcome = welcomeMessages[role] || welcomeMessages.cliente;
  document.getElementById('welcomeTitle').textContent = welcome.title;
  document.getElementById('welcomeSubtitle').textContent = welcome.subtitle;

  function authHeaders(){ return { Authorization: `Bearer ${token}` }; }

  const sideMenu = document.getElementById('sideMenu');
  const sectionContainer = document.getElementById('sectionContainer');
  const kpisWrap = document.getElementById('kpis');
  const upcomingBody = document.getElementById('upcomingBody');

  const sections = {
    cliente: [
      { id:'perfil', label:'Mi perfil', icon:'bi-person-circle', action: renderPerfil },
      { id:'tatuajes', label:'Mis tatuajes', icon:'bi-palette', action: renderMisTatuajes },
      { id:'citas', label:'Mis citas', icon:'bi-calendar-check', action: renderMisCitas },
    ],
    tatuador: [
      { id:'agenda', label:'Mi Agenda', icon:'bi-calendar3', action: renderAgendaTatuador },
      { id:'calendario', label:'Calendario Visual', icon:'bi-calendar-week', action: linkTo('calendario.html') },
      { id:'portafolio', label:'Mi Portafolio', icon:'bi-palette', action: linkTo('portafolio.html') },
      { id:'citas', label:'Gestionar Citas', icon:'bi-list-check', action: renderMisCitas },
      { id:'clientes', label:'Mis clientes', icon:'bi-people', action: renderMisClientes },
      { id:'pagos', label:'Pagos', icon:'bi-cash-coin', action: renderPagosTatuador },
      { id:'perfil', label:'Mi Perfil', icon:'bi-brush', action: renderPerfilTatuador },
    ],
    soporte: [
      { id:'resumen', label:'Resumen', icon:'bi-speedometer2', action: renderResumenAdmin },
      { id:'clientes', label:'Clientes', icon:'bi-people', action: linkTo('clientes.html') },
      { id:'tatuadores', label:'Tatuadores', icon:'bi-brush', action: linkTo('tatuadores.html') },
      { id:'pagos', label:'Pagos', icon:'bi-cash-stack', action: linkTo('pagos.html') },
      { id:'citas', label:'Citas', icon:'bi-calendar-event', action: linkTo('citas.html') },
    ]
  };

  function linkTo(href){
    return () => {
      sectionContainer.innerHTML = `
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="mb-2">Abrir módulo</h5>
            <a class="btn btn-primary" href="${href}">Ir a ${href.replace('.html','')}</a>
          </div>
        </div>`;
    };
  }

  function setActive(id){
    document.querySelectorAll('#sideMenu .nav-link').forEach(a=> a.classList.remove('active'));
    const el = document.querySelector(`#sideMenu .nav-link[data-id="${id}"]`);
    if (el) el.classList.add('active');
  }

  function renderMenu(){
    const items = sections[role] || sections['cliente'];
    sideMenu.innerHTML = '';
    items.forEach((s,i)=>{
      const a = document.createElement('a');
      a.href = '#';
      a.className = `nav-link ${i===0?'active':''}`;
      a.dataset.id = s.id;
      a.innerHTML = `<i class="bi ${s.icon}"></i><span>${s.label}</span>`;
      a.addEventListener('click', (e)=>{ e.preventDefault(); setActive(s.id); s.action(); });
      sideMenu.appendChild(a);
    });
    
    // Render quick actions menu
    renderQuickActions();
    
    // Render first section
    (items[0] && items[0].action) && items[0].action();
  }

  function renderQuickActions() {
    const quickActionsMenu = document.getElementById('quickActionsMenu');
    if (!quickActionsMenu) return;

    const actions = {
      cliente: [
        { label: 'Nueva Cita', icon: 'bi-plus-circle', href: 'citas.html', color: '#667eea' },
        { label: 'Mis Tatuajes', icon: 'bi-images', href: 'tatuajes-existente.html', color: '#10b981' }
      ],
      tatuador: [
        { label: 'Portafolio', icon: 'bi-palette', href: 'portafolio.html', color: '#667eea' },
        { label: 'Calendario', icon: 'bi-calendar-week', href: 'calendario.html', color: '#10b981' },
        { label: 'Nueva Cita', icon: 'bi-calendar-plus', href: 'citas.html', color: '#f59e0b' }
      ],
      soporte: [
        { label: 'Gestionar Todo', icon: 'bi-gear', href: 'citas.html', color: '#667eea' }
      ]
    };

    const quickActions = actions[role] || actions.cliente;
    const html = `
      <div class="mt-4">
        <div class="text-uppercase text-muted small fw-semibold mb-2">Acciones Rápidas</div>
        ${quickActions.map(a => `
          <a href="${a.href}" class="quick-action d-block mb-2 text-decoration-none">
            <i class="bi ${a.icon} fs-4" style="color: ${a.color}"></i>
            <div class="small fw-semibold mt-2" style="color: ${a.color}">${a.label}</div>
          </a>
        `).join('')}
      </div>
    `;
    quickActionsMenu.innerHTML = html;
  }

  // KPIs diferenciados por rol
  async function loadKPIs(){
    if (!kpisWrap) return;
    try {
      const [citasRes, tatuadoresRes, clientesRes, tatuajesRes] = await Promise.all([
        fetch('/api/citas', { headers: authHeaders() }).then(r=> r.ok ? r.json() : []),
        fetch('/api/tatuadores', { headers: authHeaders() }).then(r=> r.ok ? r.json() : []).catch(()=>[]),
        fetch('/api/clientes', { headers: authHeaders() }).then(r=> r.ok ? r.json() : []).catch(()=>[]),
        fetch('/api/tatuajes/mios', { headers: authHeaders() }).then(r=> r.ok ? r.json() : []).catch(()=>[]),
      ]);
      
      const today = new Date();
      const isSameDay = (a,b)=> a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();
      const citasHoy = (citasRes||[]).filter(c=> c.fecha_hora_inicio && isSameDay(new Date(c.fecha_hora_inicio), today)).length;
      const citasPendientes = (citasRes||[]).filter(c=> c.estado === 'solicitud' || c.estado === 'programada').length;
      const citasConfirmadas = (citasRes||[]).filter(c=> c.estado === 'confirmada').length;
      const ingresosHoy = (citasRes||[])
        .filter(c=> c.pago_estado==='pagado' && c.pago_monto && c.fecha_hora_inicio && isSameDay(new Date(c.fecha_hora_inicio), today))
        .reduce((s,c)=> s + Number(c.pago_monto||0), 0);
      const ingresosMes = (citasRes||[])
        .filter(c=> c.pago_estado==='pagado' && c.pago_monto && c.fecha_hora_inicio && new Date(c.fecha_hora_inicio).getMonth() === today.getMonth())
        .reduce((s,c)=> s + Number(c.pago_monto||0), 0);
      const fmtMoney = (n)=> new Intl.NumberFormat('es-CO',{style:'currency', currency:'COP', minimumFractionDigits: 0}).format(n||0);

      const card = (title, value, icon, bgColor, iconColor)=> `
        <div class="col-6 col-md-3">
          <div class="card card-kpi shadow-sm">
            <div class="card-body d-flex align-items-center justify-content-between">
              <div>
                <div class="text-muted small mb-1">${title}</div>
                <div class="fs-4 fw-bold">${value}</div>
              </div>
              <div class="kpi-icon" style="background: ${bgColor}; color: ${iconColor};">
                <i class="bi ${icon}"></i>
              </div>
            </div>
          </div>
        </div>`;

      // KPIs específicos por rol
      let kpisHTML = '';
      if (role === 'cliente') {
        kpisHTML = [
          card('Mis Citas', (citasRes||[]).length, 'bi-calendar-check', 'rgba(102, 126, 234, 0.1)', '#667eea'),
          card('Citas Pendientes', citasPendientes, 'bi-clock-history', 'rgba(245, 158, 11, 0.1)', '#f59e0b'),
          card('Tatuajes', (tatuajesRes||[]).length, 'bi-palette', 'rgba(16, 185, 129, 0.1)', '#10b981'),
          card('Próximas', citasConfirmadas, 'bi-calendar-event', 'rgba(139, 92, 246, 0.1)', '#8b5cf6')
        ].join('');
      } else if (role === 'tatuador') {
        kpisHTML = [
          card('Citas Hoy', citasHoy, 'bi-calendar-day', 'rgba(102, 126, 234, 0.1)', '#667eea'),
          card('Ingresos Hoy', fmtMoney(ingresosHoy), 'bi-cash-coin', 'rgba(16, 185, 129, 0.1)', '#10b981'),
          card('Ingresos Mes', fmtMoney(ingresosMes), 'bi-graph-up-arrow', 'rgba(245, 158, 11, 0.1)', '#f59e0b'),
          card('Pendientes', citasPendientes, 'bi-exclamation-circle', 'rgba(239, 68, 68, 0.1)', '#ef4444')
        ].join('');
      } else {
        kpisHTML = [
          card('Citas Totales', (citasRes||[]).length, 'bi-calendar-check', 'rgba(102, 126, 234, 0.1)', '#667eea'),
          card('Ingresos Mes', fmtMoney(ingresosMes), 'bi-cash-stack', 'rgba(16, 185, 129, 0.1)', '#10b981'),
          card('Tatuadores', (tatuadoresRes||[]).length, 'bi-brush', 'rgba(139, 92, 246, 0.1)', '#8b5cf6'),
          card('Clientes', (clientesRes||[]).length, 'bi-people', 'rgba(245, 158, 11, 0.1)', '#f59e0b')
        ].join('');
      }
      
      kpisWrap.innerHTML = kpisHTML;
    } catch (e) {
      console.error('Error loading KPIs:', e);
      kpisWrap.innerHTML = '';
    }
  }

  async function loadUpcoming(){
    if (!upcomingBody) return;
    try {
      let data = [];
      try{
        const r1 = await fetch('/api/citas', { headers: authHeaders() });
        data = r1.ok ? await r1.json() : [];
      }catch{}
      const now = new Date();
      const upcoming = (data||[])
        .filter(c=> c.fecha_hora_inicio && new Date(c.fecha_hora_inicio) >= now)
        .sort((a,b)=> new Date(a.fecha_hora_inicio) - new Date(b.fecha_hora_inicio))
        .slice(0,5);
      const badge = (estado)=>{
        const map = { 
          pendiente:'warning', 
          solicitud:'secondary', 
          programada:'info', 
          confirmada:'primary', 
          realizada:'success', 
          cancelada:'danger' 
        };
        const cls = map[String(estado||'').toLowerCase()] || 'secondary';
        return `<span class="badge badge-status text-bg-${cls}">${estado||'—'}</span>`;
      };
      const rows = upcoming.map(c=> `
        <tr>
          <td><i class="bi bi-person-circle me-2 text-muted"></i>${c.cliente_nombre || c.id_usuario_cliente || '—'}</td>
          <td><i class="bi bi-brush me-2 text-muted"></i>${c.tatuador_nombre || c.id_usuario_tatuador || '—'}</td>
          <td>${c.servicio_nombre || '—'}</td>
          <td><i class="bi bi-clock me-2 text-muted"></i>${formatDate(c.fecha_hora_inicio)}</td>
          <td>${badge(c.estado)}</td>
          <td>
            <a class="btn btn-sm btn-outline-primary" href="citas.html">
              <i class="bi bi-eye"></i>
            </a>
          </td>
        </tr>`).join('');
      upcomingBody.innerHTML = rows || `<tr><td colspan="6" class="text-center text-muted py-4">
        <i class="bi bi-calendar-x fs-3 d-block mb-2"></i>
        Sin próximas citas programadas
      </td></tr>`;
    } catch (e) {
      upcomingBody.innerHTML = `<tr><td colspan="6" class="text-center text-danger py-4">
        <i class="bi bi-exclamation-triangle fs-3 d-block mb-2"></i>
        No se pudieron cargar las citas
      </td></tr>`;
    }
  }

  async function renderPerfil(){
    sectionContainer.innerHTML = cardLoading('Mi Perfil');
    
    try {
      const res = await fetch('/api/perfil', { headers: authHeaders() });
      const perfil = res.ok ? await res.json() : null;
      
      if (!perfil || perfil.necesitaPerfil) {
        sectionContainer.innerHTML = `
          <div class="card shadow-sm mb-3">
            <div class="card-body text-center py-5">
              <i class="bi bi-person-circle text-muted" style="font-size: 4rem;"></i>
              <h5 class="mt-3 mb-2">Completa tu perfil</h5>
              <p class="text-muted mb-4">Necesitamos algunos datos para personalizar tu experiencia</p>
              <a href="completar-perfil.html" class="btn btn-primary">
                <i class="bi bi-pencil me-2"></i>Completar Perfil
              </a>
            </div>
          </div>`;
        return;
      }

      // Mostrar perfil completo
      sectionContainer.innerHTML = `
        <div class="card shadow-sm mb-3">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h5 class="mb-0"><i class="bi bi-person-circle me-2"></i>Mi Perfil</h5>
              <a href="completar-perfil.html" class="btn btn-sm btn-outline-primary">
                <i class="bi bi-pencil me-1"></i>Editar
              </a>
            </div>

            <div class="row g-4">
              <!-- Información Personal -->
              <div class="col-md-6">
                <div class="border rounded-3 p-3 h-100">
                  <h6 class="text-muted mb-3"><i class="bi bi-person-badge me-2"></i>Información Personal</h6>
                  <div class="mb-3">
                    <label class="small text-muted d-block">Nombre Completo</label>
                    <div class="fw-semibold">${perfil.nombre_completo || 'No especificado'}</div>
                  </div>
                  <div class="mb-3">
                    <label class="small text-muted d-block">Correo Electrónico</label>
                    <div class="fw-semibold">${perfil.email || 'No especificado'}</div>
                  </div>
                  ${perfil.edad ? `
                  <div class="mb-3">
                    <label class="small text-muted d-block">Edad</label>
                    <div class="fw-semibold">${perfil.edad} años</div>
                  </div>` : ''}
                  ${perfil.nickname ? `
                  <div class="mb-0">
                    <label class="small text-muted d-block">Nickname</label>
                    <div class="fw-semibold">${perfil.nickname}</div>
                  </div>` : ''}
                </div>
              </div>

              <!-- Información de Contacto -->
              <div class="col-md-6">
                <div class="border rounded-3 p-3 h-100">
                  <h6 class="text-muted mb-3"><i class="bi bi-telephone me-2"></i>Información de Contacto</h6>
                  <div class="mb-3">
                    <label class="small text-muted d-block">Teléfono</label>
                    <div class="fw-semibold">${perfil.telefono || 'No especificado'}</div>
                  </div>
                  ${perfil.direccion ? `
                  <div class="mb-3">
                    <label class="small text-muted d-block">Dirección</label>
                    <div class="fw-semibold">${perfil.direccion}</div>
                  </div>` : ''}
                  <div class="mb-0">
                    <label class="small text-muted d-block">Tipo de Usuario</label>
                    <div>
                      <span class="badge bg-primary">${perfil.tipo || 'Cliente'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Estadísticas Rápidas -->
            <div class="mt-4 p-3 bg-light rounded-3">
              <div class="row text-center g-3">
                <div class="col-4">
                  <div class="small text-muted">Miembro desde</div>
                  <div class="fw-bold">${new Date().getFullYear()}</div>
                </div>
                <div class="col-4">
                  <div class="small text-muted">Perfil</div>
                  <div class="fw-bold text-success">Completo</div>
                </div>
                <div class="col-4">
                  <div class="small text-muted">Estado</div>
                  <div class="fw-bold text-success">Activo</div>
                </div>
              </div>
            </div>
          </div>
        </div>`;
    } catch (err) {
      console.error('Error al cargar perfil:', err);
      sectionContainer.innerHTML = `
        <div class="card shadow-sm mb-3">
          <div class="card-body text-center py-4">
            <i class="bi bi-exclamation-triangle text-warning" style="font-size: 3rem;"></i>
            <h5 class="mt-3 mb-2">Error al cargar perfil</h5>
            <p class="text-muted mb-3">No se pudieron obtener los datos del perfil</p>
            <button class="btn btn-primary" onclick="location.reload()">
              <i class="bi bi-arrow-clockwise me-2"></i>Reintentar
            </button>
          </div>
        </div>`;
    }
  }

  async function renderPerfilTatuador(){
    sectionContainer.innerHTML = cardLoading('Mi Perfil de Artista');
    
    try {
      const res = await fetch('/api/tatuadores/perfil', { headers: authHeaders() });
      const perfil = res.ok ? await res.json() : null;
      
      if (!perfil || perfil.necesitaPerfil) {
        sectionContainer.innerHTML = `
          <div class="card shadow-sm mb-3">
            <div class="card-body text-center py-5">
              <i class="bi bi-brush text-muted" style="font-size: 4rem;"></i>
              <h5 class="mt-3 mb-2">Completa tu Perfil de Artista</h5>
              <p class="text-muted mb-4">Configura tu perfil profesional para que los clientes te conozcan mejor</p>
              <a href="completar-perfil-tatuador.html" class="btn btn-primary">
                <i class="bi bi-pencil me-2"></i>Completar Perfil
              </a>
            </div>
          </div>`;
        return;
      }

      // Mostrar perfil completo
      sectionContainer.innerHTML = `
        <div class="card shadow-sm mb-3">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h5 class="mb-0"><i class="bi bi-brush me-2"></i>Mi Perfil de Artista</h5>
              <a href="completar-perfil-tatuador.html" class="btn btn-sm btn-outline-primary">
                <i class="bi bi-pencil me-1"></i>Editar
              </a>
            </div>

            <div class="row g-4">
              <!-- Información Profesional -->
              <div class="col-md-6">
                <div class="border rounded-3 p-3 h-100">
                  <h6 class="text-muted mb-3"><i class="bi bi-person-badge me-2"></i>Información Profesional</h6>
                  <div class="mb-3">
                    <label class="small text-muted d-block">Nombre Artístico</label>
                    <div class="fw-semibold fs-5">${perfil.nombre_artistico || 'No especificado'}</div>
                  </div>
                  ${perfil.nombre_real ? `
                  <div class="mb-3">
                    <label class="small text-muted d-block">Nombre Real</label>
                    <div class="fw-semibold">${perfil.nombre_real}</div>
                  </div>` : ''}
                  ${perfil.especialidad ? `
                  <div class="mb-0">
                    <label class="small text-muted d-block">Especialidad</label>
                    <div>
                      <span class="badge bg-primary">${perfil.especialidad}</span>
                    </div>
                  </div>` : ''}
                </div>
              </div>

              <!-- Información de Contacto -->
              <div class="col-md-6">
                <div class="border rounded-3 p-3 h-100">
                  <h6 class="text-muted mb-3"><i class="bi bi-info-circle me-2"></i>Información de Contacto</h6>
                  <div class="mb-3">
                    <label class="small text-muted d-block">Correo Electrónico</label>
                    <div class="fw-semibold">${perfil.email || 'No especificado'}</div>
                  </div>
                  ${perfil.telefono ? `
                  <div class="mb-3">
                    <label class="small text-muted d-block">Teléfono</label>
                    <div class="fw-semibold">${perfil.telefono}</div>
                  </div>` : ''}
                  ${perfil.portfolio_url ? `
                  <div class="mb-3">
                    <label class="small text-muted d-block">Portafolio</label>
                    <div>
                      <a href="${perfil.portfolio_url}" target="_blank" class="text-primary">
                        <i class="bi bi-link-45deg me-1"></i>Ver portafolio
                      </a>
                    </div>
                  </div>` : ''}
                  <div class="mb-0">
                    <label class="small text-muted d-block">Tipo de Usuario</label>
                    <div>
                      <span class="badge bg-primary">Tatuador</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Estadísticas -->
            <div class="mt-4 p-3 bg-light rounded-3">
              <div class="row text-center g-3">
                <div class="col-6">
                  <div class="small text-muted">Perfil</div>
                  <div class="fw-bold text-success">Completo</div>
                </div>
                <div class="col-6">
                  <div class="small text-muted">Tipo</div>
                  <div class="fw-bold">Tatuador</div>
                </div>
              </div>
            </div>

            <!-- Acciones Rápidas -->
            <div class="mt-4">
              <h6 class="mb-3">Acciones Rápidas</h6>
              <div class="row g-2">
                <div class="col-md-6">
                  <a href="portafolio.html" class="btn btn-outline-primary w-100">
                    <i class="bi bi-images me-2"></i>Mi Portafolio
                  </a>
                </div>
                <div class="col-md-6">
                  <a href="calendario.html" class="btn btn-outline-primary w-100">
                    <i class="bi bi-calendar-week me-2"></i>Mi Calendario
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>`;
    } catch (err) {
      console.error('Error al cargar perfil de tatuador:', err);
      sectionContainer.innerHTML = `
        <div class="card shadow-sm mb-3">
          <div class="card-body text-center py-4">
            <i class="bi bi-exclamation-triangle text-warning" style="font-size: 3rem;"></i>
            <h5 class="mt-3 mb-2">Error al cargar perfil</h5>
            <p class="text-muted mb-3">No se pudieron obtener los datos del perfil</p>
            <button class="btn btn-primary" onclick="location.reload()">
              <i class="bi bi-arrow-clockwise me-2"></i>Reintentar
            </button>
          </div>
        </div>`;
    }
  }

  async function renderAgendaTatuador(){
    sectionContainer.innerHTML = cardLoading('Mi Agenda');
    try{
      const res = await fetch('/api/citas', { headers: authHeaders() });
      const data = res.ok ? await res.json() : [];
      
      // Agrupar citas por fecha
      const today = new Date();
      const citasHoy = (data||[]).filter(c=> {
        if (!c.fecha_hora_inicio) return false;
        const d = new Date(c.fecha_hora_inicio);
        return d.toDateString() === today.toDateString();
      });
      
      const proximosDias = (data||[]).filter(c=> {
        if (!c.fecha_hora_inicio) return false;
        const d = new Date(c.fecha_hora_inicio);
        return d > today && d <= new Date(today.getTime() + 7*24*60*60*1000);
      }).sort((a,b)=> new Date(a.fecha_hora_inicio) - new Date(b.fecha_hora_inicio));

      const badge = (estado)=>{
        const map = { solicitud:'secondary', programada:'info', confirmada:'primary', realizada:'success', cancelada:'danger' };
        return `<span class="badge badge-status text-bg-${map[estado]||'secondary'}">${estado}</span>`;
      };

      sectionContainer.innerHTML = `
        <div class="section-title">Mi Agenda</div>
        
        <div class="row g-3 mb-4">
          <div class="col-md-6">
            <div class="card shadow-sm">
              <div class="card-body">
                <h6 class="mb-3"><i class="bi bi-calendar-day me-2 text-primary"></i>Citas de Hoy</h6>
                ${citasHoy.length > 0 ? citasHoy.map(c=> `
                  <div class="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                    <div>
                      <div class="fw-semibold">${c.cliente_nombre || 'Cliente'}</div>
                      <small class="text-muted">${formatDate(c.fecha_hora_inicio)}</small>
                    </div>
                    ${badge(c.estado)}
                  </div>
                `).join('') : '<p class="text-muted">No hay citas programadas para hoy</p>'}
              </div>
            </div>
          </div>
          
          <div class="col-md-6">
            <div class="card shadow-sm">
              <div class="card-body">
                <h6 class="mb-3"><i class="bi bi-calendar-week me-2 text-success"></i>Próximos 7 Días</h6>
                ${proximosDias.length > 0 ? proximosDias.slice(0,5).map(c=> `
                  <div class="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                    <div>
                      <div class="fw-semibold">${c.cliente_nombre || 'Cliente'}</div>
                      <small class="text-muted">${formatDate(c.fecha_hora_inicio)}</small>
                    </div>
                    ${badge(c.estado)}
                  </div>
                `).join('') : '<p class="text-muted">No hay citas próximas</p>'}
              </div>
            </div>
          </div>
        </div>

        <div class="text-center">
          <a href="citas.html" class="btn btn-primary">
            <i class="bi bi-calendar-plus me-2"></i>Ver Agenda Completa
          </a>
        </div>
      `;
    }catch{
      sectionContainer.innerHTML = errorCard('No se pudo cargar la agenda');
    }
  }

  async function renderPagosTatuador(){
    sectionContainer.innerHTML = cardLoading('Gestión de Pagos');
    try{
      const res = await fetch('/api/citas', { headers: authHeaders() });
      const data = res.ok ? await res.json() : [];
      
      const today = new Date();
      const thisMonth = today.getMonth();
      const thisYear = today.getFullYear();
      
      const pagosMes = (data||[]).filter(c=> {
        if (c.pago_estado !== 'pagado' || !c.pago_monto) return false;
        const d = c.pago_fecha ? new Date(c.pago_fecha) : (c.fecha_hora_inicio ? new Date(c.fecha_hora_inicio) : null);
        return d && d.getMonth() === thisMonth && d.getFullYear() === thisYear;
      });
      
      const totalMes = pagosMes.reduce((s,c)=> s + Number(c.pago_monto||0), 0);
      const pendientes = (data||[]).filter(c=> c.estado === 'realizada' && c.pago_estado !== 'pagado').length;
      const fmtMoney = (n)=> new Intl.NumberFormat('es-CO',{style:'currency', currency:'COP', minimumFractionDigits: 0}).format(n||0);

      sectionContainer.innerHTML = `
        <div class="section-title">Gestión de Pagos</div>
        
        <div class="row g-3 mb-4">
          <div class="col-md-4">
            <div class="card shadow-sm text-center">
              <div class="card-body">
                <i class="bi bi-cash-stack fs-1 text-success mb-2"></i>
                <div class="text-muted small">Ingresos del Mes</div>
                <div class="fs-3 fw-bold text-success">${fmtMoney(totalMes)}</div>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card shadow-sm text-center">
              <div class="card-body">
                <i class="bi bi-check-circle fs-1 text-primary mb-2"></i>
                <div class="text-muted small">Pagos Registrados</div>
                <div class="fs-3 fw-bold text-primary">${pagosMes.length}</div>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card shadow-sm text-center">
              <div class="card-body">
                <i class="bi bi-exclamation-circle fs-1 text-warning mb-2"></i>
                <div class="text-muted small">Pagos Pendientes</div>
                <div class="fs-3 fw-bold text-warning">${pendientes}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="card shadow-sm mb-3">
          <div class="card-body">
            <h6 class="mb-3">Últimos Pagos</h6>
            <div class="table-responsive">
              <table class="table table-sm">
                <thead class="table-light">
                  <tr><th>Cliente</th><th>Monto</th><th>Fecha</th><th>Estado</th></tr>
                </thead>
                <tbody>
                  ${pagosMes.slice(0,5).map(c=> `
                    <tr>
                      <td>${c.cliente_nombre || 'Cliente'}</td>
                      <td class="fw-semibold">${fmtMoney(c.pago_monto)}</td>
                      <td>${formatDate(c.pago_fecha || c.fecha_hora_inicio)}</td>
                      <td><span class="badge text-bg-success">Pagado</span></td>
                    </tr>
                  `).join('') || '<tr><td colspan="4" class="text-center text-muted">No hay pagos registrados</td></tr>'}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="text-center">
          <a href="pagos.html" class="btn btn-primary me-2">
            <i class="bi bi-cash me-2"></i>Registrar Pago
          </a>
          <a href="pagos.html" class="btn btn-outline-primary">
            <i class="bi bi-graph-up me-2"></i>Ver Reportes
          </a>
        </div>
      `;
    }catch{
      sectionContainer.innerHTML = errorCard('No se pudieron cargar los pagos');
    }
  }

  async function renderMisTatuajes(){
    sectionContainer.innerHTML = cardLoading('Mis tatuajes');
    try{
      const res = await fetch('/api/tatuajes/mios', { headers: authHeaders() });
      const data = res.ok ? await res.json() : [];
      const cards = (data||[]).map(t => `
        <div class="col-12 col-md-6 col-lg-4">
          <div class="card h-100">
            ${t.url_imagen ? `<img class="card-img-top" src="${t.url_imagen}" alt="tatuaje">` : ''}
            <div class="card-body">
              <h6 class="card-title mb-1">${t.categoria || 'Tatuaje'}</h6>
              <div class="text-muted small mb-1">${t.ubicacion_cuerpo || ''}</div>
              <div class="text-muted small">${t.descripcion||''}</div>
            </div>
          </div>
        </div>`).join('');
      sectionContainer.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h5 class="mb-0">Mis tatuajes</h5>
          <a href="tatuajes-existente.html" class="btn btn-sm btn-primary">Registrar tatuajes</a>
        </div>
        <div class="row g-3">${cards || emptyState('Aún no registras tatuajes')}</div>`;
    }catch{
      sectionContainer.innerHTML = errorCard('No se pudieron cargar tus tatuajes');
    }
  }

  async function renderMisCitas(){
    sectionContainer.innerHTML = cardLoading('Mis citas');
    try{
      // Intentar ruta dedicada, si falla usar lista general con filtros por rol en backend
      let data = [];
      try{
        const r1 = await fetch('/api/citas/mias', { headers: authHeaders() });
        if (r1.ok) data = await r1.json();
      }catch{}
      if (!Array.isArray(data) || data.length===0){
        const r2 = await fetch('/api/citas', { headers: authHeaders() });
        data = r2.ok ? await r2.json() : [];
      }
      const rows = (data||[]).map(c=> `
        <tr>
          <td>${c.id_cita}</td>
          <td>${c.servicio_nombre || c.id_servicio || '—'}</td>
          <td><span class="badge text-bg-secondary">${c.estado}</span></td>
          <td>${formatDate(c.fecha_hora_inicio)}</td>
          <td>${formatDate(c.fecha_hora_fin)}</td>
        </tr>`).join('');
      sectionContainer.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h5 class="mb-0">Mis citas</h5>
          <a href="citas.html" class="btn btn-sm btn-primary">Ver todas</a>
        </div>
        <div class="card shadow-sm">
          <div class="table-responsive">
            <table class="table table-sm table-striped mb-0">
              <thead><tr><th>#</th><th>Servicio</th><th>Estado</th><th>Inicio</th><th>Fin</th></tr></thead>
              <tbody>${rows || `<tr><td colspan="5" class="text-center text-muted">${'Sin resultados'}</td></tr>`}</tbody>
            </table>
          </div>
        </div>`;
    }catch{
      sectionContainer.innerHTML = errorCard('No se pudieron cargar tus citas');
    }
  }

  async function renderMisClientes(){
    sectionContainer.innerHTML = cardLoading('Mis clientes');
    try{
      const r = await fetch('/api/citas', { headers: authHeaders() });
      const data = r.ok ? await r.json() : [];
      const map = new Map();
      (data||[]).forEach(c=>{
        const name = c.cliente_nombre || c.id_usuario_cliente;
        if (name) map.set(String(name), true);
      });
      const items = Array.from(map.keys()).map((n)=> `<li class="list-group-item d-flex justify-content-between align-items-center">${n}<span class="badge bg-primary">Cliente</span></li>`).join('');
      sectionContainer.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h5 class="mb-0">Mis clientes</h5>
          <a href="clientes.html" class="btn btn-sm btn-primary">Ver módulo clientes</a>
        </div>
        <ul class="list-group">${items || `<li class='list-group-item text-muted'>Sin clientes asociados</li>`}</ul>`;
    }catch{
      sectionContainer.innerHTML = errorCard('No se pudieron cargar tus clientes');
    }
  }

  async function renderResumenAdmin(){
    sectionContainer.innerHTML = cardLoading('Resumen');
    try{
      const [citasRes, servRes, tatRes, cliRes] = await Promise.all([
        fetch('/api/citas', { headers: authHeaders() }).then(r=> r.ok?r.json():[]),
        fetch('/api/servicios', { headers: authHeaders() }).then(r=> r.ok?r.json():[]),
        fetch('/api/tatuadores', { headers: authHeaders() }).then(r=> r.ok?r.json():[]),
        fetch('/api/clientes', { headers: authHeaders() }).then(r=> r.ok?r.json():[]),
      ]);
      const kpi = (label, value, color) => `
        <div class="col-6 col-md-3">
          <div class="card shadow-sm" style="border-left:4px solid ${color}">
            <div class="card-body">
              <div class="text-muted small">${label}</div>
              <div class="fs-4 fw-semibold">${value}</div>
            </div>
          </div>
        </div>`;
      sectionContainer.innerHTML = `
        <div class="row g-3">
          ${kpi('Citas', (citasRes||[]).length, '#0d6efd')}
          ${kpi('Servicios', (servRes||[]).length, '#ff7a00')}
          ${kpi('Tatuadores', (tatRes||[]).length, '#0b0b0d')}
          ${kpi('Clientes', (cliRes||[]).length, '#111827')}
        </div>
        <div class="mt-3">
          <a href="citas.html" class="btn btn-primary me-2">Gestionar citas</a>
          <a href="clientes.html" class="btn btn-outline-secondary me-2">Clientes</a>
          <a href="tatuadores.html" class="btn btn-outline-secondary me-2">Tatuadores</a>
          <a href="servicios.html" class="btn btn-outline-secondary">Servicios</a>
        </div>`;
    }catch{
      sectionContainer.innerHTML = errorCard('No se pudo cargar el resumen');
    }
  }

  function cardLoading(title){
    return `<div class="card shadow-sm"><div class="card-body"><div class="d-flex align-items-center"><div class="spinner-border text-primary me-3" role="status"></div><div><div class="fw-semibold">${title}</div><div class="text-muted small">Cargando…</div></div></div></div></div>`;
  }
  function errorCard(msg){
    return `<div class="alert alert-danger">${msg}</div>`;
  }
  function emptyState(text){
    return `<div class="col-12"><div class="text-center text-muted">${text}</div></div>`;
  }
  function formatDate(dt){
    if (!dt) return '—';
    try { return new Date(dt).toLocaleString(); } catch { return dt; }
  }

  renderMenu();
  loadKPIs();
  loadUpcoming();
})();
