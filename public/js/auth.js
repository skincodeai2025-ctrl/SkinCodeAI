// public/js/auth.js
const isRegisterPage = window.location.pathname.includes('registro.html');

document.getElementById('form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const clave = document.getElementById('clave').value;
  let tipo = null;

  const btn = e.target.querySelector('button[type="submit"]');
  const originalText = btn ? btn.innerHTML : '';
  if (btn) { btn.disabled = true; btn.innerHTML = isRegisterPage ? 'Registrando…' : 'Entrando…'; }

  if (!email || !clave) {
    alert('Por favor ingresa email y contraseña.');
    return;
  }

  if (isRegisterPage) {
    tipo = document.getElementById('tipo')?.value;
    if (!tipo) {
      alert('Selecciona un tipo de usuario.');
      return;
    }
    const c2 = document.getElementById('clave2');
    if (c2 && clave !== c2.value) {
      c2.classList.add('is-invalid');
      c2.focus();
      if (btn) { btn.disabled = false; btn.innerHTML = originalText; }
      return;
    } else if (c2) {
      c2.classList.remove('is-invalid');
    }
  }

  const url = isRegisterPage ? '/api/auth/register' : '/api/auth/login';
  const payload = isRegisterPage ? { email, clave, tipo } : { email, clave };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (response.ok) {
      if (isRegisterPage) {
        // Registro exitoso → redirigir a login
        const alert = document.getElementById('formAlert');
        if (alert) alert.innerHTML = '<div class="alert alert-success">Registro exitoso. Ahora inicia sesión.</div>';
        window.location.href = 'login.html';
      } else {
        // Login exitoso
        localStorage.setItem('token', data.token);
        if (data.rol) localStorage.setItem('role', data.rol);
        if (data.necesitaPerfil) {
          window.location.href = 'completar-perfil.html';
        } else {
          window.location.href = 'dashboard.html';
        }
      }
    } else {
      const alert = document.getElementById('formAlert');
      if (alert) alert.innerHTML = `<div class="alert alert-danger">${data.error || 'Algo salió mal.'}</div>`;
    }
  } catch (err) {
    console.error('Error de red:', err);
    const alert = document.getElementById('formAlert');
    if (alert) alert.innerHTML = `<div class="alert alert-danger">No se pudo conectar con el servidor.</div>`;
  } finally {
    if (btn) { btn.disabled = false; btn.innerHTML = originalText; }
  }
});

// Inicializar Google Sign-In
(async function initGoogle(){
  try {
    const cfgRes = await fetch('/api/auth/config');
    const cfg = await cfgRes.json();
    const clientId = cfg.googleClientId;
    if (!clientId || !window.google || !google.accounts || !google.accounts.id) return;

    google.accounts.id.initialize({
      client_id: clientId,
      callback: async (credentialResponse) => {
        try {
          const id_token = credentialResponse.credential;
          const resp = await fetch('/api/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_token })
          });
          const data = await resp.json();
          if (resp.ok) {
            localStorage.setItem('token', data.token);
            if (data.rol) localStorage.setItem('role', data.rol);
            if (data.necesitaPerfil) {
              window.location.href = 'completar-perfil.html';
            } else {
              window.location.href = 'dashboard.html';
            }
          } else {
            alert('Google: ' + (data.error || 'No se pudo iniciar sesión.'));
          }
        } catch (err) {
          console.error('Google login error:', err);
          alert('No se pudo iniciar sesión con Google.');
        }
      },
      auto_select: false,
      ux_mode: 'popup'
    });
    const container = document.getElementById('g_id_signin');
    if (container) {
      google.accounts.id.renderButton(container, { theme: 'outline', size: 'large', width: 360 });
    }
  } catch (e) { /* ignore */ }
})();