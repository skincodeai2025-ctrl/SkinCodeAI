// public/js/notificaciones.js - Sistema de notificaciones en tiempo real
(function() {
  const token = localStorage.getItem('token');
  if (!token) return;

  const POLL_INTERVAL = 30000; // 30 segundos
  let pollTimer = null;
  let lastCount = 0;

  function authHeaders() {
    return { Authorization: `Bearer ${token}` };
  }

  /**
   * Inicializar el sistema de notificaciones
   */
  function init() {
    // Crear el contenedor de notificaciones si no existe
    if (!document.getElementById('notificationBell')) {
      createNotificationBell();
    }

    // Cargar contador inicial
    updateNotificationCount();

    // Polling cada 30 segundos
    pollTimer = setInterval(updateNotificationCount, POLL_INTERVAL);

    // Limpiar al salir
    window.addEventListener('beforeunload', () => {
      if (pollTimer) clearInterval(pollTimer);
    });
  }

  /**
   * Crear el icono de campana en el navbar
   */
  function createNotificationBell() {
    const navbar = document.querySelector('.navbar .d-flex');
    if (!navbar) return;

    const bellContainer = document.createElement('div');
    bellContainer.className = 'position-relative';
    bellContainer.innerHTML = `
      <button class="btn btn-link text-white position-relative" id="notificationBell" type="button">
        <i class="bi bi-bell fs-5"></i>
        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" 
              id="notificationBadge" style="display: none; font-size: 0.65rem;">
          0
        </span>
      </button>
    `;

    // Insertar antes del botón de salir
    const logoutBtn = navbar.querySelector('button[onclick="logout()"]');
    if (logoutBtn) {
      navbar.insertBefore(bellContainer, logoutBtn);
    } else {
      navbar.appendChild(bellContainer);
    }

    // Event listener para abrir panel
    document.getElementById('notificationBell').addEventListener('click', toggleNotificationPanel);
  }

  /**
   * Actualizar contador de notificaciones
   */
  async function updateNotificationCount() {
    try {
      const res = await fetch('/api/notificaciones/count', {
        headers: authHeaders()
      });

      if (!res.ok) return;

      const data = await res.json();
      const count = data.total || 0;

      updateBadge(count);

      // Si hay nuevas notificaciones, mostrar toast
      if (count > lastCount) {
        showNewNotificationToast(count - lastCount);
      }

      lastCount = count;
    } catch (err) {
      console.error('Error al actualizar contador de notificaciones:', err);
    }
  }

  /**
   * Actualizar badge visual
   */
  function updateBadge(count) {
    const badge = document.getElementById('notificationBadge');
    if (!badge) return;

    if (count > 0) {
      badge.textContent = count > 99 ? '99+' : count;
      badge.style.display = 'block';
    } else {
      badge.style.display = 'none';
    }
  }

  /**
   * Mostrar toast de nueva notificación
   */
  function showNewNotificationToast(count) {
    // Crear toast si no existe
    let toastContainer = document.getElementById('notificationToastContainer');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'notificationToastContainer';
      toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
      toastContainer.style.zIndex = '9999';
      document.body.appendChild(toastContainer);
    }

    const toastId = 'toast_' + Date.now();
    const toastHTML = `
      <div id="${toastId}" class="toast align-items-center text-white bg-primary border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">
            <i class="bi bi-bell-fill me-2"></i>
            <strong>${count}</strong> ${count === 1 ? 'nueva notificación' : 'nuevas notificaciones'}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    `;

    toastContainer.insertAdjacentHTML('beforeend', toastHTML);

    const toastEl = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastEl, { delay: 4000 });
    toast.show();

    // Remover del DOM después de ocultarse
    toastEl.addEventListener('hidden.bs.toast', () => {
      toastEl.remove();
    });
  }

  /**
   * Toggle del panel de notificaciones
   */
  async function toggleNotificationPanel() {
    let panel = document.getElementById('notificationPanel');

    if (panel) {
      // Si existe, cerrarlo
      panel.remove();
      return;
    }

    // Crear panel
    panel = document.createElement('div');
    panel.id = 'notificationPanel';
    panel.className = 'notification-panel';
    panel.innerHTML = `
      <div class="notification-panel-header">
        <h6 class="mb-0">Notificaciones</h6>
        <div>
          <button class="btn btn-sm btn-link text-primary p-0 me-2" onclick="notificationSystem.markAllAsRead()">
            <i class="bi bi-check-all"></i> Marcar todas
          </button>
          <button class="btn btn-sm btn-link text-muted p-0" onclick="notificationSystem.closePanel()">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
      </div>
      <div class="notification-panel-body" id="notificationList">
        <div class="text-center py-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(panel);

    // Cargar notificaciones
    await loadNotifications();

    // Cerrar al hacer clic fuera
    setTimeout(() => {
      document.addEventListener('click', handleOutsideClick);
    }, 100);
  }

  /**
   * Cerrar panel al hacer clic fuera
   */
  function handleOutsideClick(e) {
    const panel = document.getElementById('notificationPanel');
    const bell = document.getElementById('notificationBell');

    if (panel && !panel.contains(e.target) && !bell.contains(e.target)) {
      closePanel();
    }
  }

  /**
   * Cerrar panel de notificaciones
   */
  function closePanel() {
    const panel = document.getElementById('notificationPanel');
    if (panel) {
      panel.remove();
      document.removeEventListener('click', handleOutsideClick);
    }
  }

  /**
   * Cargar lista de notificaciones
   */
  async function loadNotifications() {
    const listContainer = document.getElementById('notificationList');
    if (!listContainer) return;

    try {
      const res = await fetch('/api/notificaciones?limit=20', {
        headers: authHeaders()
      });

      if (!res.ok) throw new Error('Error al cargar notificaciones');

      const notificaciones = await res.json();

      if (notificaciones.length === 0) {
        listContainer.innerHTML = `
          <div class="text-center py-5 text-muted">
            <i class="bi bi-bell-slash fs-1 d-block mb-2"></i>
            <p class="mb-0">No tienes notificaciones</p>
          </div>
        `;
        return;
      }

      listContainer.innerHTML = notificaciones.map(n => renderNotification(n)).join('');

      // Agregar event listeners
      notificaciones.forEach(n => {
        const el = document.getElementById(`notif_${n.id_notificacion}`);
        if (el && !n.leida) {
          el.addEventListener('click', () => markAsRead(n.id_notificacion));
        }
      });

    } catch (err) {
      console.error('Error al cargar notificaciones:', err);
      listContainer.innerHTML = `
        <div class="text-center py-4 text-danger">
          <i class="bi bi-exclamation-triangle fs-3 d-block mb-2"></i>
          <p class="mb-0">Error al cargar notificaciones</p>
        </div>
      `;
    }
  }

  /**
   * Renderizar una notificación
   */
  function renderNotification(notif) {
    const iconMap = {
      info: 'bi-info-circle text-info',
      success: 'bi-check-circle text-success',
      warning: 'bi-exclamation-triangle text-warning',
      error: 'bi-x-circle text-danger',
      cita: 'bi-calendar-check text-primary'
    };

    const icon = iconMap[notif.tipo] || iconMap.info;
    const unreadClass = notif.leida ? '' : 'notification-unread';
    const timeAgo = getTimeAgo(notif.fecha_creacion);

    return `
      <div class="notification-item ${unreadClass}" id="notif_${notif.id_notificacion}">
        <div class="notification-icon">
          <i class="bi ${icon}"></i>
        </div>
        <div class="notification-content">
          <div class="notification-title">${notif.titulo}</div>
          <div class="notification-message">${notif.mensaje || ''}</div>
          <div class="notification-time">${timeAgo}</div>
        </div>
        ${!notif.leida ? '<div class="notification-dot"></div>' : ''}
      </div>
    `;
  }

  /**
   * Marcar notificación como leída
   */
  async function markAsRead(id) {
    try {
      const res = await fetch(`/api/notificaciones/${id}/leer`, {
        method: 'PUT',
        headers: authHeaders()
      });

      if (res.ok) {
        const el = document.getElementById(`notif_${id}`);
        if (el) {
          el.classList.remove('notification-unread');
          const dot = el.querySelector('.notification-dot');
          if (dot) dot.remove();
        }

        // Actualizar contador
        await updateNotificationCount();
      }
    } catch (err) {
      console.error('Error al marcar como leída:', err);
    }
  }

  /**
   * Marcar todas como leídas
   */
  async function markAllAsRead() {
    try {
      const res = await fetch('/api/notificaciones/leer-todas', {
        method: 'PUT',
        headers: authHeaders()
      });

      if (res.ok) {
        // Recargar lista
        await loadNotifications();
        await updateNotificationCount();
      }
    } catch (err) {
      console.error('Error al marcar todas como leídas:', err);
    }
  }

  /**
   * Calcular tiempo transcurrido
   */
  function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'Hace un momento';
    if (seconds < 3600) return `Hace ${Math.floor(seconds / 60)} min`;
    if (seconds < 86400) return `Hace ${Math.floor(seconds / 3600)} h`;
    if (seconds < 604800) return `Hace ${Math.floor(seconds / 86400)} días`;
    
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  }

  // Exponer funciones públicas
  window.notificationSystem = {
    init,
    updateNotificationCount,
    closePanel,
    markAllAsRead
  };

  // Auto-inicializar si hay token
  if (token) {
    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }

})();
