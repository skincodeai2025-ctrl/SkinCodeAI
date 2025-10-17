document.getElementById('perfilForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      nombre: document.getElementById('nombre').value,
      fecha_naci: document.getElementById('fecha_naci').value,
      telefono: document.getElementById('telefono').value || null,
      direccion: document.getElementById('direccion').value || null
    };
  
    const res = await fetch('/api/perfil/completar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify(data)
    });
  
    const result = await res.json();
    if (res.ok) {
      alert('Perfil completado');
      window.location.href = 'dashboard.html';
    } else {
      alert('Error: ' + result.error);
    }
  });