// src/controllers/notificacionController.js
const Notificaciones = require('../models/Notificaciones');

/**
 * Obtener notificaciones del usuario autenticado
 */
exports.getMisNotificaciones = async (req, res) => {
  try {
    const { id_usuario } = req.usuario;
    const { limit = 20, offset = 0, solo_no_leidas = false } = req.query;

    const notificaciones = await Notificaciones.getByUsuario(id_usuario, {
      limit: parseInt(limit),
      offset: parseInt(offset),
      solo_no_leidas: solo_no_leidas === 'true'
    });

    res.json(notificaciones);
  } catch (err) {
    console.error('Error al obtener notificaciones:', err);
    res.status(500).json({ error: 'Error al cargar notificaciones.' });
  }
};

/**
 * Contar notificaciones no leídas
 */
exports.contarNoLeidas = async (req, res) => {
  try {
    const { id_usuario } = req.usuario;
    const total = await Notificaciones.countNoLeidas(id_usuario);
    res.json({ total });
  } catch (err) {
    console.error('Error al contar notificaciones:', err);
    res.status(500).json({ error: 'Error al contar notificaciones.' });
  }
};

/**
 * Marcar notificación como leída
 */
exports.marcarLeida = async (req, res) => {
  try {
    const { id_usuario } = req.usuario;
    const { id } = req.params;
    
    const success = await Notificaciones.marcarLeida(id, id_usuario);
    
    if (!success) {
      return res.status(404).json({ error: 'Notificación no encontrada.' });
    }
    
    res.json({ message: 'Notificación marcada como leída.' });
  } catch (err) {
    console.error('Error al marcar notificación:', err);
    res.status(500).json({ error: 'Error al marcar notificación.' });
  }
};

/**
 * Marcar todas las notificaciones como leídas
 */
exports.marcarTodasLeidas = async (req, res) => {
  try {
    const { id_usuario } = req.usuario;
    const count = await Notificaciones.marcarTodasLeidas(id_usuario);
    res.json({ message: `${count} notificaciones marcadas como leídas.`, count });
  } catch (err) {
    console.error('Error al marcar todas como leídas:', err);
    res.status(500).json({ error: 'Error al marcar notificaciones.' });
  }
};

/**
 * Eliminar notificación
 */
exports.eliminar = async (req, res) => {
  try {
    const { id_usuario } = req.usuario;
    const { id } = req.params;
    
    const success = await Notificaciones.delete(id, id_usuario);
    
    if (!success) {
      return res.status(404).json({ error: 'Notificación no encontrada.' });
    }
    
    res.json({ message: 'Notificación eliminada.' });
  } catch (err) {
    console.error('Error al eliminar notificación:', err);
    res.status(500).json({ error: 'Error al eliminar notificación.' });
  }
};
