// public/js/portafolio.js - Galería de trabajos por tatuador
(function() {
  const token = localStorage.getItem('token');
  if (!token) { window.location.href = 'login.html'; return; }

  let allWorks = [];
  let currentFilter = 'all';
  let currentWorkId = null;

  function authHeaders() {
    return { 
      'Authorization': `Bearer ${token}`
    };
  }

  function authHeadersJSON() {
    return { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Inicializar
   */
  async function init() {
    await loadProfile();
    await loadWorks();
  }

  /**
   * Cargar perfil del tatuador
   */
  async function loadProfile() {
    try {
      // Obtener ID del usuario del token
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.id_usuario;

      // Cargar datos del tatuador
      const res = await fetch(`/api/tatuadores/${userId}`, {
        headers: authHeaders()
      });

      if (res.ok) {
        const tatuador = await res.json();
        
        // Actualizar UI
        const initials = tatuador.nombre ? tatuador.nombre.substring(0, 2).toUpperCase() : 'TA';
        document.getElementById('profileAvatar').innerHTML = initials;
        document.getElementById('profileName').textContent = tatuador.nombre || 'Tatuador';
        document.getElementById('profileSpecialty').textContent = tatuador.especialidad || 'Artista del Tatuaje';
        
        if (tatuador.bio) {
          document.getElementById('profileBio').innerHTML = `
            <i class="bi bi-quote me-2"></i>${tatuador.bio}
          `;
        } else {
          document.getElementById('profileBio').innerHTML = `
            <i class="bi bi-info-circle me-2"></i>
            <em>Agrega una biografía en tu perfil para que tus clientes te conozcan mejor.</em>
          `;
        }
      }
    } catch (err) {
      console.error('Error al cargar perfil:', err);
    }
  }

  /**
   * Cargar trabajos (tatuajes)
   */
  async function loadWorks() {
    try {
      const res = await fetch('/api/tatuajes/mios', {
        headers: authHeaders()
      });

      if (!res.ok) throw new Error('Error al cargar trabajos');

      allWorks = await res.json();
      updateStats();
      renderGallery();
    } catch (err) {
      console.error('Error al cargar trabajos:', err);
      showError('No se pudieron cargar los trabajos');
    }
  }

  /**
   * Actualizar estadísticas
   */
  function updateStats() {
    const total = allWorks.length;
    const categorias = new Set(allWorks.map(w => w.categoria).filter(Boolean)).size;
    
    // Clientes únicos (si hay campo cliente_nombre)
    const clientes = new Set(allWorks.map(w => w.cliente_nombre).filter(Boolean)).size;
    
    // Trabajos del mes actual
    const now = new Date();
    const thisMonth = allWorks.filter(w => {
      if (!w.fecha_creacion) return false;
      const d = new Date(w.fecha_creacion);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;

    document.getElementById('statTotalTrabajos').textContent = total;
    document.getElementById('statCategorias').textContent = categorias || '-';
    document.getElementById('statClientes').textContent = clientes || '-';
    document.getElementById('statRecientes').textContent = thisMonth;
  }

  /**
   * Renderizar galería
   */
  function renderGallery() {
    const container = document.getElementById('galleryGrid');
    
    // Filtrar trabajos
    let filtered = allWorks;
    if (currentFilter !== 'all') {
      filtered = allWorks.filter(w => 
        w.categoria && w.categoria.toLowerCase() === currentFilter.toLowerCase()
      );
    }

    // Ordenar por fecha (más recientes primero)
    filtered.sort((a, b) => {
      const dateA = new Date(a.fecha_creacion || 0);
      const dateB = new Date(b.fecha_creacion || 0);
      return dateB - dateA;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1;">
          <i class="bi bi-image"></i>
          <h5>No hay trabajos para mostrar</h5>
          <p class="text-muted">
            ${currentFilter === 'all' 
              ? 'Comienza a subir tus trabajos para crear tu portafolio' 
              : 'No hay trabajos en esta categoría'}
          </p>
          <button class="btn btn-upload mt-3" onclick="openUploadModal()">
            <i class="bi bi-cloud-upload me-2"></i>Subir Primer Trabajo
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(work => renderWorkCard(work)).join('');
  }

  /**
   * Renderizar card de trabajo
   */
  function renderWorkCard(work) {
    const imageUrl = work.url_imagen || '';
    const hasImage = imageUrl && imageUrl.trim() !== '';
    const categoria = work.categoria || 'Sin categoría';
    const ubicacion = work.ubicacion_cuerpo || '';
    const descripcion = work.descripcion || '';
    const fecha = work.fecha_creacion ? formatDate(work.fecha_creacion) : '';

    return `
      <div class="gallery-item" onclick="viewWork(${work.id_tatuaje})">
        <div class="gallery-item-image">
          ${hasImage 
            ? `<img src="${imageUrl}" alt="${categoria}" loading="lazy">` 
            : `<i class="bi bi-image"></i>`
          }
        </div>
        <div class="gallery-item-overlay">
          <div>
            <div class="fw-bold mb-1">${categoria}</div>
            ${descripcion ? `<div class="small">${truncate(descripcion, 80)}</div>` : ''}
          </div>
        </div>
        <div class="gallery-item-content">
          <div class="gallery-item-title">${categoria}</div>
          <div class="gallery-item-meta">
            ${ubicacion ? `<span><i class="bi bi-geo-alt"></i>${ubicacion}</span>` : ''}
            ${fecha ? `<span><i class="bi bi-calendar"></i>${fecha}</span>` : ''}
          </div>
          <span class="badge-category">${categoria}</span>
        </div>
      </div>
    `;
  }

  /**
   * Ver detalle del trabajo
   */
  window.viewWork = async function(id) {
    currentWorkId = id;
    const work = allWorks.find(w => w.id_tatuaje === id);
    if (!work) return;

    const modal = new bootstrap.Modal(document.getElementById('modalViewImage'));
    
    // Configurar imagen
    const imageUrl = work.url_imagen || '';
    const hasImage = imageUrl && imageUrl.trim() !== '';
    
    if (hasImage) {
      document.getElementById('modalImage').src = imageUrl;
      document.getElementById('modalImage').style.display = 'block';
    } else {
      document.getElementById('modalImage').style.display = 'none';
    }

    // Configurar información
    document.getElementById('modalImageInfo').innerHTML = `
      <div class="row g-3 text-start">
        <div class="col-md-6">
          <label class="small text-muted">Categoría</label>
          <div class="fw-semibold">${work.categoria || 'Sin categoría'}</div>
        </div>
        <div class="col-md-6">
          <label class="small text-muted">Ubicación</label>
          <div class="fw-semibold">${work.ubicacion_cuerpo || 'No especificada'}</div>
        </div>
        ${work.descripcion ? `
          <div class="col-12">
            <label class="small text-muted">Descripción</label>
            <div>${work.descripcion}</div>
          </div>
        ` : ''}
        ${work.cliente_nombre ? `
          <div class="col-md-6">
            <label class="small text-muted">Cliente</label>
            <div class="fw-semibold">${work.cliente_nombre}</div>
          </div>
        ` : ''}
        ${work.fecha_creacion ? `
          <div class="col-md-6">
            <label class="small text-muted">Fecha</label>
            <div>${formatDate(work.fecha_creacion)}</div>
          </div>
        ` : ''}
      </div>
    `;

    modal.show();
  };

  /**
   * Filtrar galería
   */
  window.filterGallery = function(filter) {
    currentFilter = filter;
    
    // Actualizar botones
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');

    renderGallery();
  };

  /**
   * Abrir modal de subida
   */
  window.openUploadModal = function() {
    const modal = new bootstrap.Modal(document.getElementById('modalUpload'));
    document.getElementById('formUpload').reset();
    modal.show();
  };

  /**
   * Subir trabajo
   */
  document.getElementById('formUpload')?.addEventListener('submit', async function(e) {
    e.preventDefault();

    const fileInput = document.getElementById('imageFile');
    const file = fileInput.files[0];

    if (!file) {
      showToast('Por favor selecciona una imagen', 'error');
      return;
    }

    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('La imagen no debe superar 5MB', 'error');
      return;
    }

    try {
      // Convertir imagen a base64
      const base64 = await fileToBase64(file);

      const data = {
        categoria: document.getElementById('categoria').value,
        ubicacion_cuerpo: document.getElementById('ubicacion').value || null,
        descripcion: document.getElementById('descripcion').value || null,
        url_imagen: base64
      };

      const res = await fetch('/api/tatuajes', {
        method: 'POST',
        headers: authHeadersJSON(),
        body: JSON.stringify(data)
      });

      if (!res.ok) throw new Error('Error al subir trabajo');

      showToast('Trabajo subido exitosamente', 'success');
      bootstrap.Modal.getInstance(document.getElementById('modalUpload')).hide();
      
      // Recargar trabajos
      await loadWorks();

    } catch (err) {
      console.error('Error:', err);
      showToast('Error al subir el trabajo', 'error');
    }
  });

  /**
   * Eliminar trabajo
   */
  window.deleteWork = async function() {
    if (!currentWorkId) return;

    if (!confirm('¿Estás seguro de eliminar este trabajo? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const res = await fetch(`/api/tatuajes/${currentWorkId}`, {
        method: 'DELETE',
        headers: authHeaders()
      });

      if (!res.ok) throw new Error('Error al eliminar');

      showToast('Trabajo eliminado', 'success');
      bootstrap.Modal.getInstance(document.getElementById('modalViewImage')).hide();
      
      // Recargar trabajos
      await loadWorks();

    } catch (err) {
      console.error('Error:', err);
      showToast('Error al eliminar el trabajo', 'error');
    }
  };

  /**
   * Convertir archivo a base64
   */
  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Utilidades
   */
  function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  function truncate(str, length) {
    if (!str) return '';
    return str.length > length ? str.substring(0, length) + '...' : str;
  }

  function showError(message) {
    document.getElementById('galleryGrid').innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1;">
        <i class="bi bi-exclamation-triangle text-danger"></i>
        <h5>Error</h5>
        <p class="text-muted">${message}</p>
        <button class="btn btn-primary mt-3" onclick="location.reload()">
          <i class="bi bi-arrow-clockwise me-2"></i>Reintentar
        </button>
      </div>
    `;
  }

  function showToast(message, type = 'info') {
    const bgClass = type === 'success' ? 'bg-success' : type === 'error' ? 'bg-danger' : 'bg-primary';
    
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white ${bgClass} border-0`;
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
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
