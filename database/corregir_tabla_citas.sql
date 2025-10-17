-- ============================================
-- CORREGIR ESTRUCTURA DE TABLA CITAS
-- ============================================

USE skincodeia;

-- Deshabilitar foreign key checks temporalmente
SET FOREIGN_KEY_CHECKS = 0;

-- Eliminar tabla citas si existe
DROP TABLE IF EXISTS citas;

-- Crear tabla citas con estructura correcta
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

-- Crear índices para mejorar rendimiento
CREATE INDEX idx_citas_cliente ON citas(id_usuario_cliente);
CREATE INDEX idx_citas_tatuador ON citas(id_usuario_tatuador);
CREATE INDEX idx_citas_estado ON citas(estado);
CREATE INDEX idx_citas_fecha_inicio ON citas(fecha_hora_inicio);

-- Rehabilitar foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Verificar estructura
DESCRIBE citas;

-- Mostrar columnas con detalles
SELECT 
    COLUMN_NAME as 'Columna',
    DATA_TYPE as 'Tipo',
    IS_NULLABLE as 'Nulo',
    COLUMN_KEY as 'Clave',
    COLUMN_DEFAULT as 'Default',
    EXTRA as 'Extra'
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'skincodeia' AND TABLE_NAME = 'citas'
ORDER BY ORDINAL_POSITION;

-- Mostrar foreign keys
SELECT 
    CONSTRAINT_NAME as 'Constraint',
    COLUMN_NAME as 'Columna',
    REFERENCED_TABLE_NAME as 'Tabla Referenciada',
    REFERENCED_COLUMN_NAME as 'Columna Referenciada'
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'skincodeia' 
  AND TABLE_NAME = 'citas'
  AND REFERENCED_TABLE_NAME IS NOT NULL;

-- Insertar datos de prueba (opcional)
INSERT INTO citas (
    id_usuario_cliente, 
    id_servicio, 
    estado, 
    notas_cliente
) VALUES 
(1, 1, 'solicitud', 'Quiero un tatuaje pequeño en el brazo'),
(1, 2, 'programada', 'Tatuaje mediano en la espalda');

-- Verificar datos insertados
SELECT * FROM citas;

SELECT '✅ TABLA CITAS CREADA CORRECTAMENTE' AS Resultado;
