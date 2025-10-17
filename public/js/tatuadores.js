const API_URL = '/api/tatuadores';

function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function cargarTatuadores() {
  const res = await fetch(API_URL, { headers: getAuthHeader() });
  if (res.status === 401) {
    alert('Sesión expirada. Por favor inicia sesión.');
    window.location.href = 'login.html';
    return;
  }
  const lista = await res.json();
  const tbody = document.querySelector('#tabla-tatuadores tbody');
  tbody.innerHTML = '';
  lista.forEach(t => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${t.id_usuario}</td>
      <td>${t.nombre_artistico}</td>
      <td>${t.nombre_real || '—'}</td>
      <td>${t.especialidad || '—'}</td>
      <td>${t.activo ? 'Sí' : 'No'}</td>
    `;
    tbody.appendChild(tr);
  });
}

cargarTatuadores();
