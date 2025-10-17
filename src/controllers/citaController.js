const db = require('../config/db');
const Citas = require('../models/Citas');
const Notificaciones = require('../models/Notificaciones');

exports.crearSolicitud = async (req, res) => {
  const { id_usuario } = req.usuario;
  const { id_servicio, notas_cliente, notas_internas, url_referencia } = req.body;

  try {
    // Obtener el precio del servicio si se especificó un servicio
    let precio_servicio = null;
    if (id_servicio) {
      const [servicios] = await db.execute(
        'SELECT precio FROM servicios WHERE id_servicio = ? AND activo = 1',
        [id_servicio]
      );
      if (servicios.length > 0) {
        precio_servicio = servicios[0].precio;
      }
    }

    const [result] = await db.execute(`
      INSERT INTO citas (
        id_usuario_cliente, id_servicio, notas_cliente, notas_internas, url_referencia, precio, estado
      ) VALUES (?, ?, ?, ?, ?, ?, 'solicitud')
    `, [
      id_usuario,
      id_servicio || null,
      notas_cliente || null,
      notas_internas || null,
      url_referencia || null,
      precio_servicio
    ]);

    const id_cita = result.insertId;
    
    // Crear notificación
    await Notificaciones.notificarCambioCita(id_cita, null, 'solicitud');

    res.status(201).json({ 
      id_cita, 
      precio: precio_servicio,
      message: 'Solicitud registrada con precio del servicio.' 
    });
  } catch (err) {
    console.error('Error al crear solicitud:', err);
    res.status(500).json({ error: 'No se pudo registrar la solicitud.' });
  }
};

exports.getMisCitas = async (req, res) => {
  const { id_usuario } = req.usuario;

  try {
    // Determinar rol
    let rol = 'soporte';
    try {
      const [r] = await db.execute(`
        SELECT r.nombre AS rol
        FROM usuario_roles ur
        JOIN roles r ON r.id_rol = ur.id_rol
        WHERE ur.id_usuario = ?
        LIMIT 1
      `, [id_usuario]);
      if (r && r[0] && r[0].rol) rol = r[0].rol;
    } catch {}

    let filters = {};
    if (rol === 'cliente') filters.id_usuario_cliente = id_usuario;
    else if (rol === 'tatuador') filters.id_usuario_tatuador = id_usuario;

    const rows = await Citas.list({ ...filters, limit: 100, offset: 0 });
    res.json(rows);
  } catch (err) {
    console.error('Error al cargar citas:', err);
    res.status(500).json({ error: 'Error al cargar citas.' });
  }
};

// Nuevos handlers CRUD / transiciones
exports.list = async (req, res) => {
  try {
    const { estado, id_servicio, fecha_desde, fecha_hasta } = req.query;

    // Determinar rol del solicitante
    const { id_usuario } = req.usuario || {};
    let rol = 'soporte';
    try {
      const [r] = await db.execute(`
        SELECT r.nombre AS rol
        FROM usuario_roles ur
        JOIN roles r ON r.id_rol = ur.id_rol
        WHERE ur.id_usuario = ?
        LIMIT 1
      `, [id_usuario]);
      if (r && r[0] && r[0].rol) rol = r[0].rol;
    } catch {}

    // Filtros por rol
    let id_usuario_cliente = undefined;
    let id_usuario_tatuador = undefined;
    if (rol === 'cliente') id_usuario_cliente = id_usuario;
    if (rol === 'tatuador') id_usuario_tatuador = id_usuario;

    // Paginación
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const offset = (page - 1) * limit;

    const rows = await Citas.list({ id_usuario_cliente, id_usuario_tatuador, id_servicio, estado, fecha_desde, fecha_hasta, limit, offset });
    res.json(rows);
  } catch (err) {
    console.error('Error al listar citas:', err);
    res.status(500).json({ error: 'Error al listar citas.' });
  }
};

exports.getById = async (req, res) => {
  try {
    const cita = await Citas.getById(req.params.id);
    if (!cita) return res.status(404).json({ error: 'Cita no encontrada' });
    res.json(cita);
  } catch (err) {
    console.error('Error al obtener cita:', err);
    res.status(500).json({ error: 'Error al obtener cita.' });
  }
};

exports.update = async (req, res) => {
  try {
    await Citas.update(req.params.id, req.body);
    res.json({ message: 'Cita actualizada' });
  } catch (err) {
    console.error('Error al actualizar cita:', err);
    res.status(500).json({ error: 'Error al actualizar cita.' });
  }
};

exports.programar = async (req, res) => {
  try {
    const { id_usuario_tatuador, fecha_hora_inicio, fecha_hora_fin, precio, notas_internas } = req.body;
    const id_cita = req.params.id;
    
    // Obtener estado anterior
    const citaAnterior = await Citas.getById(id_cita);
    const estadoAnterior = citaAnterior?.estado;
    
    await Citas.programar(id_cita, { id_usuario_tatuador, fecha_hora_inicio, fecha_hora_fin, precio, notas_internas });
    
    // Notificar cambio de estado
    await Notificaciones.notificarCambioCita(id_cita, estadoAnterior, 'programada');
    
    res.json({ message: 'Cita programada' });
  } catch (err) {
    console.error('Error al programar cita:', err);
    res.status(500).json({ error: 'Error al programar cita.' });
  }
};

exports.confirmar = async (req, res) => {
  try {
    const id_cita = req.params.id;
    
    // Obtener estado anterior
    const citaAnterior = await Citas.getById(id_cita);
    const estadoAnterior = citaAnterior?.estado;
    
    await Citas.confirmar(id_cita);
    
    // Notificar cambio de estado
    await Notificaciones.notificarCambioCita(id_cita, estadoAnterior, 'confirmada');
    
    res.json({ message: 'Cita confirmada' });
  } catch (err) {
    console.error('Error al confirmar cita:', err);
    res.status(500).json({ error: 'Error al confirmar cita.' });
  }
};

exports.cancelar = async (req, res) => {
  try {
    const id_cita = req.params.id;
    
    // Obtener estado anterior
    const citaAnterior = await Citas.getById(id_cita);
    const estadoAnterior = citaAnterior?.estado;
    
    await Citas.cancelar(id_cita, { notas_internas: req.body?.notas_internas });
    
    // Notificar cambio de estado
    await Notificaciones.notificarCambioCita(id_cita, estadoAnterior, 'cancelada');
    
    res.json({ message: 'Cita cancelada' });
  } catch (err) {
    console.error('Error al cancelar cita:', err);
    res.status(500).json({ error: 'Error al cancelar cita.' });
  }
};

exports.realizar = async (req, res) => {
  try {
    const id_cita = req.params.id;
    const { pago_monto, pago_estado = 'pagado', pago_fecha } = req.body || {};
    
    // Obtener estado anterior
    const citaAnterior = await Citas.getById(id_cita);
    const estadoAnterior = citaAnterior?.estado;
    
    await Citas.realizar(id_cita, { pago_monto, pago_estado, pago_fecha });
    
    // Notificar cambio de estado
    await Notificaciones.notificarCambioCita(id_cita, estadoAnterior, 'realizada');
    
    res.json({ message: 'Cita marcada como realizada' });
  } catch (err) {
    console.error('Error al marcar cita como realizada:', err);
    res.status(500).json({ error: 'Error al marcar cita como realizada.' });
  }
};

// Export CSV con mismos filtros y reglas de rol
exports.exportCsv = async (req, res) => {
  try {
    const { estado, id_servicio, fecha_desde, fecha_hasta, id_usuario_tatuador } = req.query;

    // Determinar rol
    const { id_usuario } = req.usuario || {};
    let rol = 'soporte';
    try {
      const [r] = await db.execute(`
        SELECT r.nombre AS rol
        FROM usuario_roles ur
        JOIN roles r ON r.id_rol = ur.id_rol
        WHERE ur.id_usuario = ?
        LIMIT 1
      `, [id_usuario]);
      if (r && r[0] && r[0].rol) rol = r[0].rol;
    } catch {}

    // Filtros por rol
    let id_usuario_cliente = undefined;
    let id_tatuador = id_usuario_tatuador || undefined;
    if (rol === 'cliente') id_usuario_cliente = id_usuario;
    if (rol === 'tatuador') id_tatuador = id_usuario;

    const rows = await Citas.list({ id_usuario_cliente, id_usuario_tatuador: id_tatuador, id_servicio, estado, fecha_desde, fecha_hasta });

    // Construir CSV
    const headers = ['ID','Cliente','Tatuador','Servicio','Estado','Inicio','Fin','Precio'];
    const escape = (v) => {
      const s = String(v ?? '');
      return (s.includes(',') || s.includes('"') || s.includes('\n')) ? '"' + s.replace(/"/g, '""') + '"' : s;
    };
    const lines = [headers.join(',')];
    for (const c of rows) {
      lines.push([
        c.id_cita,
        escape(c.cliente_nombre || c.id_usuario_cliente || ''),
        escape(c.tatuador_nombre || c.id_usuario_tatuador || ''),
        escape(c.servicio_nombre || ''),
        c.estado || '',
        c.fecha_hora_inicio || '',
        c.fecha_hora_fin || '',
        c.precio ?? ''
      ].join(','));
    }

    const csv = lines.join('\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="citas.csv"');
    res.send(csv);
  } catch (err) {
    console.error('Error al exportar CSV:', err);
    res.status(500).json({ error: 'Error al exportar CSV.' });
  }
};