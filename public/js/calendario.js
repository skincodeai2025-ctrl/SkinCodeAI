// public/js/calendario.js - Sistema de calendario visual para tatuadores
(function() {
  const token = localStorage.getItem('token');
  if (!token) { window.location.href = 'login.html'; return; }

  let calendar;
  let allCitas = [];

  function authHeaders() {
    return { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Inicializar calendario
   */
  function initCalendar() {
    const calendarEl = document.getElementById('calendar');
    
    calendar = new FullCalendar.Calendar(calendarEl, {
      locale: 'es',
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
      },
      buttonText: {
        today: 'Hoy',
        month: 'Mes',
        week: 'Semana',
        day: 'Día',
        list: 'Lista'
      },
      height: 'auto',
      navLinks: true,
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      weekends: true,
      
      // Cargar eventos
      events: loadEvents,
      
      // Click en evento
      eventClick: handleEventClick,
      
      // Seleccionar rango de fechas
      select: handleDateSelect,
      
      // Mover/redimensionar evento
      eventDrop: handleEventDrop,
      eventResize: handleEventResize,
      
      // Personalizar renderizado
      eventContent: renderEventContent,
      
      // Loading
      loading: function(isLoading) {
        if (isLoading) {
          console.log('Cargando eventos...');
        }
      }
    });

    calendar.render();
    updateStats();
  }

  /**
   * Cargar eventos desde API
   */
  async function loadEvents(info, successCallback, failureCallback) {
    try {
      const res = await fetch('/api/citas', {
        headers: authHeaders()
      });

      if (!res.ok) throw new Error('Error al cargar citas');

      const citas = await res.json();
      allCitas = citas;

      const events = citas
        .filter(c => c.fecha_hora_inicio)
        .map(cita => ({
          id: cita.id_cita,
          title: cita.cliente_nombre || `Cita #${cita.id_cita}`,
          start: cita.fecha_hora_inicio,
          end: cita.fecha_hora_fin || cita.fecha_hora_inicio,
          backgroundColor: getColorByEstado(cita.estado),
          borderColor: getColorByEstado(cita.estado),
          extendedProps: {
            estado: cita.estado,
            cliente: cita.cliente_nombre,
            servicio: cita.servicio_nombre,
            precio: cita.precio,
            notas: cita.notas_cliente,
            pago_estado: cita.pago_estado,
            pago_monto: cita.pago_monto
          },
          classNames: [cita.estado]
        }));

      successCallback(events);
      updateStats();
    } catch (err) {
      console.error('Error al cargar eventos:', err);
      failureCallback(err);
    }
  }

  /**
   * Obtener color según estado
   */
  function getColorByEstado(estado) {
    const colors = {
      solicitud: '#94a3b8',
      programada: '#3b82f6',
      confirmada: '#667eea',
      realizada: '#10b981',
      cancelada: '#ef4444'
    };
    return colors[estado] || '#94a3b8';
  }

  /**
   * Renderizar contenido del evento
   */
  function renderEventContent(eventInfo) {
    const time = eventInfo.timeText;
    const title = eventInfo.event.title;
    const servicio = eventInfo.event.extendedProps.servicio;

    return {
      html: `
        <div class="fc-event-main-frame">
          <div class="fc-event-time">${time}</div>
          <div class="fc-event-title-container">
            <div class="fc-event-title fc-sticky fw-semibold">${title}</div>
            ${servicio ? `<div class="fc-event-title fc-sticky small">${servicio}</div>` : ''}
          </div>
        </div>
      `
    };
  }

  /**
   * Click en evento - Mostrar detalle
   */
  async function handleEventClick(info) {
    const citaId = info.event.id;
    await showCitaDetail(citaId);
  }

  /**
   * Mostrar detalle de cita
   */
  async function showCitaDetail(citaId) {
    const modal = new bootstrap.Modal(document.getElementById('modalDetalle'));
    const bodyEl = document.getElementById('modalDetalleBody');
    const footerEl = document.getElementById('modalDetalleFooter');

    bodyEl.innerHTML = '<div class="text-center py-4"><div class="spinner-border text-primary"></div></div>';
    modal.show();

    try {
      const res = await fetch(`/api/citas/${citaId}`, {
        headers: authHeaders()
      });

      if (!res.ok) throw new Error('Error al cargar detalle');

      const cita = await res.json();

      // Renderizar detalle
      bodyEl.innerHTML = `
        <div class="row g-3">
          <div class="col-md-6">
            <label class="small text-muted">Cliente</label>
            <div class="fw-semibold">${cita.cliente_nombre || 'Sin asignar'}</div>
          </div>
          <div class="col-md-6">
            <label class="small text-muted">Estado</label>
            <div>${getBadgeEstado(cita.estado)}</div>
          </div>
          <div class="col-md-6">
            <label class="small text-muted">Servicio</label>
            <div class="fw-semibold">${cita.servicio_nombre || 'Sin servicio'}</div>
          </div>
          <div class="col-md-6">
            <label class="small text-muted">Precio</label>
            <div class="fw-semibold">${cita.precio ? formatMoney(cita.precio) : 'No definido'}</div>
          </div>
          <div class="col-md-6">
            <label class="small text-muted">Fecha Inicio</label>
            <div>${formatDateTime(cita.fecha_hora_inicio)}</div>
          </div>
          <div class="col-md-6">
            <label class="small text-muted">Fecha Fin</label>
            <div>${formatDateTime(cita.fecha_hora_fin)}</div>
          </div>
          ${cita.notas_cliente ? `
            <div class="col-12">
              <label class="small text-muted">Notas del Cliente</label>
              <div class="p-3 bg-light rounded">${cita.notas_cliente}</div>
            </div>
          ` : ''}
          ${cita.pago_estado ? `
            <div class="col-md-6">
              <label class="small text-muted">Estado de Pago</label>
              <div>${getBadgePago(cita.pago_estado)}</div>
            </div>
            <div class="col-md-6">
              <label class="small text-muted">Monto Pagado</label>
              <div class="fw-semibold">${cita.pago_monto ? formatMoney(cita.pago_monto) : '-'}</div>
            </div>
          ` : ''}
        </div>
      `;

      // Botones de acción según estado
      footerEl.innerHTML = `
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        ${getActionButtons(cita)}
      `;

    } catch (err) {
      console.error('Error:', err);
      bodyEl.innerHTML = '<div class="alert alert-danger">Error al cargar el detalle de la cita</div>';
    }
  }

  /**
   * Obtener botones de acción según estado
   */
  function getActionButtons(cita) {
    let buttons = '';

    if (cita.estado === 'solicitud') {
      buttons += `<button class="btn btn-primary" onclick="programarCita(${cita.id_cita})">
        <i class="bi bi-calendar-check me-2"></i>Programar
      </button>`;
    }

    if (cita.estado === 'programada') {
      buttons += `<button class="btn btn-success" onclick="confirmarCita(${cita.id_cita})">
        <i class="bi bi-check-circle me-2"></i>Confirmar
      </button>`;
    }

    if (cita.estado === 'confirmada') {
      buttons += `<button class="btn btn-success" onclick="realizarCita(${cita.id_cita})">
        <i class="bi bi-check-all me-2"></i>Marcar Realizada
      </button>`;
    }

    if (['solicitud', 'programada', 'confirmada'].includes(cita.estado)) {
      buttons += `<button class="btn btn-danger" onclick="cancelarCita(${cita.id_cita})">
        <i class="bi bi-x-circle me-2"></i>Cancelar
      </button>`;
    }

    return buttons;
  }

  /**
   * Seleccionar rango de fechas - Crear nueva cita
   */
  function handleDateSelect(selectInfo) {
    const start = selectInfo.start;
    const end = selectInfo.end;

    // Abrir modal de nueva cita con fechas prellenadas
    openNewAppointmentModal(start, end);

    calendar.unselect();
  }

  /**
   * Mover evento (drag & drop)
   */
  async function handleEventDrop(info) {
    const citaId = info.event.id;
    const newStart = info.event.start;
    const newEnd = info.event.end || newStart;

    try {
      const res = await fetch(`/api/citas/${citaId}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({
          fecha_hora_inicio: newStart.toISOString(),
          fecha_hora_fin: newEnd.toISOString()
        })
      });

      if (!res.ok) throw new Error('Error al actualizar');

      showToast('Cita actualizada correctamente', 'success');
      updateStats();
    } catch (err) {
      console.error('Error:', err);
      info.revert();
      showToast('Error al mover la cita', 'error');
    }
  }

  /**
   * Redimensionar evento
   */
  async function handleEventResize(info) {
    const citaId = info.event.id;
    const newEnd = info.event.end;

    try {
      const res = await fetch(`/api/citas/${citaId}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({
          fecha_hora_fin: newEnd.toISOString()
        })
      });

      if (!res.ok) throw new Error('Error al actualizar');

      showToast('Duración actualizada', 'success');
    } catch (err) {
      console.error('Error:', err);
      info.revert();
      showToast('Error al cambiar duración', 'error');
    }
  }

  /**
   * Abrir modal de nueva cita
   */
  window.openNewAppointmentModal = async function(startDate, endDate) {
    const modal = new bootstrap.Modal(document.getElementById('modalNuevaCita'));

    // Cargar clientes y servicios
    await loadClientes();
    await loadServicios();

    // Prellenar fechas si se proporcionan
    if (startDate) {
      document.getElementById('fechaInicio').value = formatDateTimeInput(startDate);
    }
    if (endDate) {
      document.getElementById('fechaFin').value = formatDateTimeInput(endDate);
    }

    modal.show();
  };

  /**
   * Cargar clientes
   */
  async function loadClientes() {
    try {
      const res = await fetch('/api/clientes', { headers: authHeaders() });
      if (!res.ok) return;

      const clientes = await res.json();
      const select = document.getElementById('clienteSelect');
      
      select.innerHTML = '<option value="">Seleccionar cliente...</option>' +
        clientes.map(c => `<option value="${c.id_usuario}">${c.nombre} ${c.primer_apellido || ''}</option>`).join('');
    } catch (err) {
      console.error('Error al cargar clientes:', err);
    }
  }

  /**
   * Cargar servicios
   */
  async function loadServicios() {
    try {
      const res = await fetch('/api/servicios', { headers: authHeaders() });
      if (!res.ok) return;

      const servicios = await res.json();
      const select = document.getElementById('servicioSelect');
      
      select.innerHTML = '<option value="">Seleccionar servicio...</option>' +
        servicios.map(s => `<option value="${s.id_servicio}">${s.nombre} - ${formatMoney(s.precio)}</option>`).join('');
    } catch (err) {
      console.error('Error al cargar servicios:', err);
    }
  }

  /**
   * Crear nueva cita
   */
  document.getElementById('formNuevaCita')?.addEventListener('submit', async function(e) {
    e.preventDefault();

    const data = {
      id_usuario_cliente: document.getElementById('clienteSelect').value,
      id_servicio: document.getElementById('servicioSelect').value,
      fecha_hora_inicio: new Date(document.getElementById('fechaInicio').value).toISOString(),
      fecha_hora_fin: new Date(document.getElementById('fechaFin').value).toISOString(),
      precio: document.getElementById('precio').value || null,
      notas_internas: document.getElementById('notas').value || null
    };

    try {
      // Primero crear la solicitud
      const resCreate = await fetch('/api/citas', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          id_servicio: data.id_servicio,
          notas_cliente: data.notas_internas
        })
      });

      if (!resCreate.ok) throw new Error('Error al crear cita');

      const { id_cita } = await resCreate.json();

      // Luego programarla
      const resProgramar = await fetch(`/api/citas/${id_cita}/programar`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({
          id_usuario_tatuador: JSON.parse(atob(token.split('.')[1])).id_usuario,
          fecha_hora_inicio: data.fecha_hora_inicio,
          fecha_hora_fin: data.fecha_hora_fin,
          precio: data.precio,
          notas_internas: data.notas_internas
        })
      });

      if (!resProgramar.ok) throw new Error('Error al programar');

      showToast('Cita creada exitosamente', 'success');
      bootstrap.Modal.getInstance(document.getElementById('modalNuevaCita')).hide();
      refreshCalendar();

    } catch (err) {
      console.error('Error:', err);
      showToast('Error al crear la cita', 'error');
    }
  });

  /**
   * Acciones de citas
   */
  window.confirmarCita = async function(id) {
    if (!confirm('¿Confirmar esta cita?')) return;

    try {
      const res = await fetch(`/api/citas/${id}/confirmar`, {
        method: 'PUT',
        headers: authHeaders()
      });

      if (!res.ok) throw new Error('Error');

      showToast('Cita confirmada', 'success');
      bootstrap.Modal.getInstance(document.getElementById('modalDetalle')).hide();
      refreshCalendar();
    } catch (err) {
      showToast('Error al confirmar', 'error');
    }
  };

  window.realizarCita = async function(id) {
    if (!confirm('¿Marcar como realizada?')) return;

    try {
      const res = await fetch(`/api/citas/${id}/realizar`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({})
      });

      if (!res.ok) throw new Error('Error');

      showToast('Cita marcada como realizada', 'success');
      bootstrap.Modal.getInstance(document.getElementById('modalDetalle')).hide();
      refreshCalendar();
    } catch (err) {
      showToast('Error al realizar', 'error');
    }
  };

  window.cancelarCita = async function(id) {
    const motivo = prompt('Motivo de cancelación (opcional):');
    if (motivo === null) return;

    try {
      const res = await fetch(`/api/citas/${id}/cancelar`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ notas_internas: motivo })
      });

      if (!res.ok) throw new Error('Error');

      showToast('Cita cancelada', 'success');
      bootstrap.Modal.getInstance(document.getElementById('modalDetalle')).hide();
      refreshCalendar();
    } catch (err) {
      showToast('Error al cancelar', 'error');
    }
  };

  /**
   * Actualizar estadísticas
   */
  function updateStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const citasMes = allCitas.filter(c => c.fecha_hora_inicio && new Date(c.fecha_hora_inicio) >= startOfMonth).length;
    const citasSemana = allCitas.filter(c => c.fecha_hora_inicio && new Date(c.fecha_hora_inicio) >= startOfWeek).length;
    const citasHoy = allCitas.filter(c => c.fecha_hora_inicio && new Date(c.fecha_hora_inicio) >= startOfDay && new Date(c.fecha_hora_inicio) < new Date(startOfDay.getTime() + 24*60*60*1000)).length;
    const citasPendientes = allCitas.filter(c => c.estado === 'solicitud' || c.estado === 'programada').length;

    document.getElementById('statsMes').textContent = citasMes;
    document.getElementById('statsSemana').textContent = citasSemana;
    document.getElementById('statsHoy').textContent = citasHoy;
    document.getElementById('statsPendientes').textContent = citasPendientes;
  }

  /**
   * Refrescar calendario
   */
  window.refreshCalendar = function() {
    calendar.refetchEvents();
  };

  /**
   * Utilidades
   */
  function getBadgeEstado(estado) {
    const badges = {
      solicitud: '<span class="badge badge-status text-bg-secondary">Solicitud</span>',
      programada: '<span class="badge badge-status text-bg-info">Programada</span>',
      confirmada: '<span class="badge badge-status text-bg-primary">Confirmada</span>',
      realizada: '<span class="badge badge-status text-bg-success">Realizada</span>',
      cancelada: '<span class="badge badge-status text-bg-danger">Cancelada</span>'
    };
    return badges[estado] || estado;
  }

  function getBadgePago(estado) {
    const badges = {
      pagado: '<span class="badge text-bg-success">Pagado</span>',
      pendiente: '<span class="badge text-bg-warning">Pendiente</span>'
    };
    return badges[estado] || estado;
  }

  function formatMoney(amount) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(amount);
  }

  function formatDateTime(dt) {
    if (!dt) return '-';
    return new Date(dt).toLocaleString('es-ES', { 
      year: 'numeric', month: 'short', day: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    });
  }

  function formatDateTimeInput(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'primary'} border-0`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    `;

    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container position-fixed top-0 end-0 p-3';
      container.style.zIndex = '9999';
      document.body.appendChild(container);
    }

    container.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast, { delay: 3000 });
    bsToast.show();

    toast.addEventListener('hidden.bs.toast', () => toast.remove());
  }

  // Inicializar al cargar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCalendar);
  } else {
    initCalendar();
  }

})();
