-- ============================================
-- CORREGIR TABLA CITAS (Con manejo de dependencias)
-- ============================================

USE skincodeia;

-- Paso 1: Deshabilitar foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- Paso 2: Eliminar tablas que dependen de citas (si existen)
DROP TABLE IF EXISTS pagos;
DROP TABLE IF EXISTS notificaciones;

-- Paso 3: Eliminar tabla citas
DROP TABLE IF EXISTS citas;

-- Paso 4: Crear tabla citas con estructura correcta
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

-- Paso 6: Recrear tabla pagos (si existía)
CREATE TABLE IF NOT EXISTS pagos (
  id_pago INT AUTO_INCREMENT PRIMARY KEY,
  id_cita INT NOT NULL,
  monto DECIMAL(10,2) NOT NULL,
  metodo ENUM('efectivo','electronico','bitcoin') NOT NULL DEFAULT 'efectivo',
  estado ENUM('pendiente','completado','fallido','reembolsado') NOT NULL DEFAULT 'pendiente',
  referencia VARCHAR(100) NULL,
  fecha_pago DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  notas TEXT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_pagos_cita FOREIGN KEY (id_cita) REFERENCES citas(id_cita) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Paso 7: Recrear tabla notificaciones (si existía)
CREATE TABLE IF NOT EXISTS notificaciones (
  id_notificacion INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  id_cita INT NULL,
  tipo ENUM('cita_creada','cita_programada','cita_confirmada','cita_cancelada','cita_realizada','recordatorio','pago_recibido','mensaje') NOT NULL,
  titulo VARCHAR(200) NOT NULL,
  mensaje TEXT NOT NULL,
  leida TINYINT(1) NOT NULL DEFAULT 0,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notif_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  CONSTRAINT fk_notif_cita FOREIGN KEY (id_cita) REFERENCES citas(id_cita) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Paso 8: Crear índices para notificaciones
CREATE INDEX idx_notif_usuario ON notificaciones(id_usuario);
CREATE INDEX idx_notif_leida ON notificaciones(leida);
CREATE INDEX idx_notif_cita ON notificaciones(id_cita);

-- Paso 9: Rehabilitar foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Paso 10: Verificar estructura de citas
DESCRIBE citas;

-- Paso 11: Verificar foreign keys
SELECT 
    CONSTRAINT_NAME as 'Constraint',
    COLUMN_NAME as 'Columna',
    REFERENCED_TABLE_NAME as 'Tabla Referenciada',
    REFERENCED_COLUMN_NAME as 'Columna Referenciada'
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'skincodeia' 
  AND TABLE_NAME = 'citas'
  AND REFERENCED_TABLE_NAME IS NOT NULL;

-- Paso 12: Insertar datos de prueba
INSERT INTO citas (
    id_usuario_cliente, 
    id_servicio, 
    estado, 
    notas_cliente
) VALUES 
(1, 1, 'solicitud', 'Quiero un tatuaje pequeño en el brazo'),
(1, 2, 'programada', 'Tatuaje mediano en la espalda');

-- Paso 13: Verificar datos
SELECT * FROM citas;

-- Resultado final
SELECT '✅ TABLA CITAS Y DEPENDENCIAS CREADAS CORRECTAMENTE' AS Resultado;
SELECT 'Tablas recreadas: citas, pagos, notificaciones' AS Info;
