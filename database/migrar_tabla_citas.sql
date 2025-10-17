-- ============================================
-- MIGRAR TABLA CITAS (Preserva datos existentes)
-- ============================================

USE skincodeia;

-- Paso 1: Crear respaldo de datos existentes (si hay)
CREATE TABLE IF NOT EXISTS citas_backup AS SELECT * FROM citas;

SELECT CONCAT('✅ Respaldo creado con ', COUNT(*), ' registros') AS Resultado
FROM citas_backup;

-- Paso 2: Deshabilitar foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- Paso 3: Eliminar tabla actual
DROP TABLE IF EXISTS citas;

-- Paso 4: Crear tabla con estructura correcta
CREATE TABLE citas (
  id_cita INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario_cliente INT NOT NULL,
  id_usuario_tatuador INT NULL,
  id_servicio INT NULL,
  estado ENUM('solicitud','programada','confirmada','cancelada','realizada') NOT NULL DEFAULT 'solicitud',
  fecha_hora_inicio DATETIME NULL,
  fecha_hora_fin DATETIME NULL,
  precio DECIMAL(10,2) NULL,
  notas_cliente TEXT NULL,
  notas_internas TEXT NULL,
  url_referencia VARCHAR(300) NULL,
  pago_estado ENUM('pendiente','pagado','reembolsado') DEFAULT 'pendiente',
  pago_monto DECIMAL(10,2) NULL,
  pago_fecha DATETIME NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_citas_cliente FOREIGN KEY (id_usuario_cliente) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  CONSTRAINT fk_citas_tatuador FOREIGN KEY (id_usuario_tatuador) REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
  CONSTRAINT fk_citas_servicio FOREIGN KEY (id_servicio) REFERENCES servicios(id_servicio) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Paso 5: Crear índices
CREATE INDEX idx_citas_cliente ON citas(id_usuario_cliente);
CREATE INDEX idx_citas_tatuador ON citas(id_usuario_tatuador);
CREATE INDEX idx_citas_estado ON citas(estado);
CREATE INDEX idx_citas_fecha_inicio ON citas(fecha_hora_inicio);

-- Paso 6: Migrar datos del respaldo (ajusta según columnas que tengas)
-- DESCOMENTA Y AJUSTA SEGÚN TU ESTRUCTURA ANTERIOR:

/*
INSERT INTO citas (
    id_usuario_cliente,
    id_usuario_tatuador,
    id_servicio,
    estado,
    fecha_hora_inicio,
    fecha_hora_fin,
    precio,
    notas_cliente,
    notas_internas,
    url_referencia,
    pago_estado,
    pago_monto,
    pago_fecha,
    creado_en
)
SELECT 
    id_cliente,              -- Ajusta según nombre de columna anterior
    id_tatuador,            -- Ajusta según nombre de columna anterior
    id_servicio,
    estado,
    fecha_inicio,           -- Ajusta según nombre de columna anterior
    fecha_fin,              -- Ajusta según nombre de columna anterior
    precio,
    notas_cliente,
    notas_internas,
    url_referencia,
    'pendiente',            -- Default si no existía
    NULL,                   -- Default si no existía
    NULL,                   -- Default si no existía
    creado_en
FROM citas_backup;
*/

-- Paso 7: Rehabilitar foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Paso 8: Verificar estructura
DESCRIBE citas;

-- Paso 9: Verificar datos migrados
SELECT COUNT(*) as 'Total de Citas' FROM citas;

-- Paso 10: Comparar con respaldo
SELECT 
    (SELECT COUNT(*) FROM citas_backup) as 'Registros Originales',
    (SELECT COUNT(*) FROM citas) as 'Registros Migrados';

-- Paso 11: Si todo está bien, puedes eliminar el respaldo
-- DROP TABLE citas_backup;

SELECT '✅ MIGRACIÓN COMPLETADA - Revisa los datos antes de eliminar citas_backup' AS Resultado;
