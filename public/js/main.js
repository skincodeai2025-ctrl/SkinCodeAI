// main.js
function getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
  
  // Ejemplo al cargar clientes
  fetch('/api/clientes', {
    headers: getAuthHeader()
  })
  .then(res => {
    if (res.status === 401) {
      alert('Sesión expirada. Por favor inicia sesión.');
      window.location.href = 'login.html';
      return;
    }
    return res.json();
  })
  .then(data => {
    // renderizar...
  });