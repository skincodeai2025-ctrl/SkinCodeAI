// src/controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../config/db');
const Usuario = require('../models/Usuario');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

const generarToken = (id) => {
  return jwt.sign({ id_usuario: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  });
};

// Exponer configuración pública de auth al frontend (Google Client ID)
exports.authConfig = (req, res) => {
  res.json({
    googleClientId: process.env.GOOGLE_CLIENT_ID || ''
  });
};

// Login con Google: verificar ID token, crear usuario si no existe y devolver JWT
exports.googleLogin = async (req, res) => {
  try {
    const { id_token } = req.body || {};
    if (!id_token) return res.status(400).json({ error: 'id_token requerido' });

    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) return res.status(500).json({ error: 'Falta GOOGLE_CLIENT_ID en el servidor' });

    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({ idToken: id_token, audience: clientId });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) return res.status(401).json({ error: 'Token inválido' });

    const email = payload.email.toLowerCase();

    // Buscar usuario existente o crearlo como cliente
    let usuario = await Usuario.findByEmail(email);
    if (!usuario) {
      // Crear con contraseña aleatoria para satisfacer el esquema actual
      const randomPass = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
      await Usuario.create(email, randomPass, 'cliente');
      usuario = await Usuario.findByEmail(email);
    }
    if (!usuario || usuario.estado !== 'activo') return res.status(401).json({ error: 'Cuenta inactiva o inválida' });

    const token = generarToken(usuario.id_usuario);

    // Verificar si el perfil está completo (solo para cliente)
    let necesitaPerfil = false;
    if (usuario.rol === 'cliente') {
      const [perfil] = await db.execute('SELECT 1 FROM clientes WHERE id_usuario = ?', [usuario.id_usuario]);
      necesitaPerfil = perfil.length === 0;
    }

    res.json({ token, necesitaPerfil, rol: usuario.rol, metodo: 'google' });
  } catch (err) {
    console.error('Google login error:', err);
    res.status(500).json({ error: 'No se pudo iniciar sesión con Google' });
  }
};

exports.registerBasic = async (req, res) => {
  const { email, clave, tipo } = req.body;
  if (!['cliente', 'tatuador'].includes(tipo)) {
    return res.status(400).json({ error: 'Tipo debe ser "cliente" o "tatuador"' });
  }
  if (!email || !clave) {
    return res.status(400).json({ error: 'Email y clave son requeridos' });
  }

  try {
    const existe = await Usuario.findByEmail(email);
    if (existe) return res.status(409).json({ error: 'Email ya registrado' });

    const nuevo = await Usuario.create(email, clave, tipo);
    res.status(201).json({ message: 'Registro exitoso. Ahora inicia sesión.', registered: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al registrar' });
  }
};

exports.login = async (req, res) => {
  const { email, clave } = req.body;
  if (!email || !clave) return res.status(400).json({ error: 'Email y clave requeridos' });

  try {
    const usuario = await Usuario.findByEmail(email);
    if (!usuario || !usuario.hash_clave) return res.status(401).json({ error: 'Credenciales inválidas' });
    if (usuario.estado !== 'activo') return res.status(401).json({ error: 'Cuenta inactiva' });

    const esValida = await bcrypt.compare(clave, usuario.hash_clave);
    if (!esValida) return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = generarToken(usuario.id_usuario);

    // Verificar si el perfil está completo (solo para cliente)
    let necesitaPerfil = false;
    if (usuario.rol === 'cliente') {
      const [perfil] = await db.execute('SELECT 1 FROM clientes WHERE id_usuario = ?', [usuario.id_usuario]);
      necesitaPerfil = perfil.length === 0;
    }

    res.json({ token, necesitaPerfil, rol: usuario.rol });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};