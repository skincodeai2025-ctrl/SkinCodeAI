// scripts/init-notificaciones.js - Script para inicializar tabla de notificaciones
require('dotenv').config();
const db = require('../src/config/db');

async function initNotificaciones() {
  console.log('🔧 Inicializando tabla de notificaciones...');

  try {
    // Crear tabla de notificaciones
    await db.execute(`
      CREATE TABLE IF NOT EXISTS notificaciones (
        id_notificacion INT AUTO_INCREMENT PRIMARY KEY,
        id_usuario INT NOT NULL,
        tipo ENUM('info', 'success', 'warning', 'error', 'cita') DEFAULT 'info',
        titulo VARCHAR(255) NOT NULL,
        mensaje TEXT,
        id_cita INT NULL,
        leida BOOLEAN DEFAULT FALSE,
        fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
        fecha_lectura DATETIME NULL,
        INDEX idx_usuario (id_usuario),
        INDEX idx_leida (leida),
        INDEX idx_fecha (fecha_creacion),
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
        FOREIGN KEY (id_cita) REFERENCES citas(id_cita) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('✅ Tabla de notificaciones creada exitosamente');

    // Verificar estructura
    const [columns] = await db.execute('DESCRIBE notificaciones');
    console.log('\n📋 Estructura de la tabla:');
    console.table(columns.map(col => ({
      Campo: col.Field,
      Tipo: col.Type,
      Nulo: col.Null,
      Clave: col.Key,
      Default: col.Default
    })));

    // Contar notificaciones existentes
    const [count] = await db.execute('SELECT COUNT(*) as total FROM notificaciones');
    console.log(`\n📊 Notificaciones existentes: ${count[0].total}`);

    console.log('\n✨ Inicialización completada!');
    process.exit(0);

  } catch (err) {
    console.error('❌ Error al inicializar:', err);
    process.exit(1);
  }
}

// Ejecutar
initNotificaciones();
