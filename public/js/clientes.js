const API_URL = '/api/clientes';

function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function cargarClientes() {
  const res = await fetch(API_URL, { headers: getAuthHeader() });
  if (res.status === 401) {
    alert('Sesión expirada. Por favor inicia sesión.');
    window.location.href = 'login.html';
    return;
  }
  const clientes = await res.json();
  const tbody = document.querySelector('#tabla-clientes tbody');
  tbody.innerHTML = '';
  clientes.forEach(c => {
    const row = `
      <tr>
        <td>${c.id_usuario}</td>
        <td>${c.nombre} ${c.primer_apellido}</td>
        <td>${c.email}</td>
        <td>${c.telefono || '—'}</td>
        <td>
          <button class="btn btn-sm btn-outline-primary" onclick="editarCliente(${c.id_usuario})">Editar</button>
          <button class="btn btn-sm btn-outline-danger" onclick="eliminarCliente(${c.id_usuario})">Eliminar</button>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

async function guardarCliente(e) {
  e.preventDefault();
  const id = document.getElementById('id_usuario').value;
  const data = {
    email: document.getElementById('email').value,
    clave: document.getElementById('clave').value,
    nombre: document.getElementById('nombre').value,
    primer_apellido: document.getElementById('primer_apellido').value,
    segundo_apellido: document.getElementById('segundo_apellido').value,
    nickname: document.getElementById('nickname').value || null,
    telefono: document.getElementById('telefono').value || null,
    direccion: document.getElementById('direccion').value || null,
    fecha_naci: document.getElementById('fecha_naci').value || null
  };

  const method = id ? 'PUT' : 'POST';
  const url = id ? `${API_URL}/${id}` : API_URL;

  const res = await fetch(url, {
    method,
    headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (res.ok) {
    cancelarForm();
    cargarClientes();
  } else {
    const err = await res.json();
    alert('Error: ' + (err.error || 'No se pudo guardar'));
  }
}

async function eliminarCliente(id) {
  if (!confirm('¿Seguro que deseas desactivar este cliente?')) return;
  await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeader()
  });
  cargarClientes();
}

function mostrarFormulario() {
  document.getElementById('formTitle').textContent = 'Nuevo Cliente';
  document.getElementById('clienteForm').reset();
  document.getElementById('id_usuario').value = '';
  document.getElementById('clave').required = true;
  document.getElementById('formCard').style.display = 'block';
}

function cancelarForm() {
  document.getElementById('formCard').style.display = 'none';
}

async function editarCliente(id) {
  const res = await fetch(`${API_URL}/${id}`, { headers: getAuthHeader() });
  const c = await res.json();
  document.getElementById('id_usuario').value = c.id_usuario;
  document.getElementById('email').value = c.email;
  document.getElementById('clave').required = false; // no se cambia clave al editar
  document.getElementById('nombre').value = c.nombre;
  document.getElementById('primer_apellido').value = c.primer_apellido;
  document.getElementById('segundo_apellido').value = c.segundo_apellido;
  document.getElementById('nickname').value = c.nickname || '';
  document.getElementById('telefono').value = c.telefono || '';
  document.getElementById('direccion').value = c.direccion || '';
  document.getElementById('fecha_naci').value = c.fecha_naci || '';
  document.getElementById('formTitle').textContent = 'Editar Cliente';
  document.getElementById('formCard').style.display = 'block';
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}

// Inicializar
document.getElementById('clienteForm').addEventListener('submit', guardarCliente);
cargarClientes();