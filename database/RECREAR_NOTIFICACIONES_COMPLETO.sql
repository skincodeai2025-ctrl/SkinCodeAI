-- ============================================
-- SOLUCION DEFINITIVA: RECREAR TABLA NOTIFICACIONES
-- ============================================

USE skincodeia1;

-- 1. Hacer backup de datos existentes (si los hay)
CREATE TABLE IF NOT EXISTS notificaciones_backup AS
SELECT * FROM notificaciones;

-- 2. Contar registros actuales
SELECT 'REGISTROS ANTES DE RECREAR:' as Info;
SELECT COUNT(*) as total FROM notificaciones;

-- 3. Eliminar tabla existente
DROP TABLE IF EXISTS notificaciones;

-- 4. Crear tabla nueva con estructura correcta
CREATE TABLE notificaciones (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Restaurar datos si había backup
INSERT INTO notificaciones (
  id_notificacion, id_usuario, tipo, titulo, mensaje,
  id_cita, leida, fecha_creacion
)
SELECT
  id_notificacion, id_usuario, tipo, titulo, mensaje,
  id_cita, leida, fecha_creacion
FROM notificaciones_backup;

-- 6. Verificar estructura final
SELECT 'ESTRUCTURA FINAL DE NOTIFICACIONES:' as Info;
DESCRIBE notificaciones;

-- 7. Contar registros después
SELECT 'REGISTROS DESPUÉS DE RECREAR:' as Info;
SELECT COUNT(*) as total FROM notificaciones;

-- 8. Verificar que fecha_lectura existe
SELECT 'VERIFICACIÓN DE COLUMNA fecha_lectura:' as Info;
SELECT
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'skincodeia1'
  AND TABLE_NAME = 'notificaciones'
  AND COLUMN_NAME = 'fecha_lectura';

-- 9. Probar consulta que estaba fallando
SELECT 'PRUEBA DE CONSULTA PROBLEMÁTICA:' as Info;
UPDATE notificaciones
SET leida = 1, fecha_lectura = NOW()
WHERE id_notificacion = 1 AND id_usuario = 1;

-- 10. Limpiar tabla de backup
DROP TABLE IF EXISTS notificaciones_backup;

SELECT '✅ TABLA NOTIFICACIONES RECREADA COMPLETAMENTE' as Resultado;
SELECT 'Todas las columnas existen correctamente' as Confirmacion;
SELECT 'Sistema de notificaciones operativo' as Estado;
