-- ============================================
-- SOLUCIÓN DEFINITIVA - ELIMINAR FOREIGN KEYS PRIMERO
-- ============================================

USE skincodeia;

-- Paso 1: Identificar y eliminar TODAS las foreign keys que apuntan a citas
SET FOREIGN_KEY_CHECKS = 0;

-- Eliminar foreign keys de pagos (si existe)
ALTER TABLE pagos DROP FOREIGN KEY IF EXISTS fk_pagos_cita;
ALTER TABLE pagos DROP FOREIGN KEY IF EXISTS pagos_ibfk_1;
ALTER TABLE pagos DROP FOREIGN KEY IF EXISTS pagos_ibfk_2;

-- Eliminar foreign keys de notificaciones (si existe)
ALTER TABLE notificaciones DROP FOREIGN KEY IF EXISTS fk_notif_cita;
ALTER TABLE notificaciones DROP FOREIGN KEY IF EXISTS notificaciones_ibfk_1;
ALTER TABLE notificaciones DROP FOREIGN KEY IF EXISTS notificaciones_ibfk_2;

-- Eliminar foreign keys de citas (si existen)
ALTER TABLE citas DROP FOREIGN KEY IF EXISTS fk_citas_cliente;
ALTER TABLE citas DROP FOREIGN KEY IF EXISTS fk_citas_tatuador;
ALTER TABLE citas DROP FOREIGN KEY IF EXISTS fk_citas_servicio;
ALTER TABLE citas DROP FOREIGN KEY IF EXISTS citas_ibfk_1;
ALTER TABLE citas DROP FOREIGN KEY IF EXISTS citas_ibfk_2;
ALTER TABLE citas DROP FOREIGN KEY IF EXISTS citas_ibfk_3;

-- Paso 2: Ahora sí eliminar las tablas
DROP TABLE IF EXISTS pagos;
DROP TABLE IF EXISTS notificaciones;
DROP TABLE IF EXISTS citas;

-- Paso 3: Crear tabla citas con estructura correcta
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
  actualizado_en TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Paso 4: Crear índices para citas
CREATE INDEX idx_citas_cliente ON citas(id_usuario_cliente);
CREATE INDEX idx_citas_tatuador ON citas(id_usuario_tatuador);
CREATE INDEX idx_citas_estado ON citas(estado);
CREATE INDEX idx_citas_fecha_inicio ON citas(fecha_hora_inicio);

-- Paso 5: Crear tabla pagos
CREATE TABLE pagos (
  id_pago INT AUTO_INCREMENT PRIMARY KEY,
  id_cita INT NOT NULL,
  monto DECIMAL(10,2) NOT NULL,
  metodo ENUM('efectivo','electronico','bitcoin') NOT NULL DEFAULT 'efectivo',
  estado ENUM('pendiente','completado','fallido','reembolsado') NOT NULL DEFAULT 'pendiente',
  referencia VARCHAR(100) NULL,
  fecha_pago DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  notas TEXT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Paso 6: Crear tabla notificaciones
CREATE TABLE notificaciones (
  id_notificacion INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  id_cita INT NULL,
  tipo ENUM('cita_creada','cita_programada','cita_confirmada','cita_cancelada','cita_realizada','recordatorio','pago_recibido','mensaje') NOT NULL,
  titulo VARCHAR(200) NOT NULL,
  mensaje TEXT NOT NULL,
  leida TINYINT(1) NOT NULL DEFAULT 0,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Paso 7: Crear índices para las otras tablas
CREATE INDEX idx_pagos_cita ON pagos(id_cita);
CREATE INDEX idx_notif_usuario ON notificaciones(id_usuario);
CREATE INDEX idx_notif_leida ON notificaciones(leida);
CREATE INDEX idx_notif_cita ON notificaciones(id_cita);

-- Paso 8: AHORA SÍ agregar las foreign keys (después de crear las tablas)
ALTER TABLE citas 
ADD CONSTRAINT fk_citas_cliente 
FOREIGN KEY (id_usuario_cliente) REFERENCES usuarios(id_usuario) ON DELETE CASCADE;

ALTER TABLE citas 
ADD CONSTRAINT fk_citas_tatuador 
FOREIGN KEY (id_usuario_tatuador) REFERENCES usuarios(id_usuario) ON DELETE SET NULL;

ALTER TABLE citas 
ADD CONSTRAINT fk_citas_servicio 
FOREIGN KEY (id_servicio) REFERENCES servicios(id_servicio) ON DELETE SET NULL;

ALTER TABLE pagos 
ADD CONSTRAINT fk_pagos_cita 
FOREIGN KEY (id_cita) REFERENCES citas(id_cita) ON DELETE CASCADE;

ALTER TABLE notificaciones 
ADD CONSTRAINT fk_notif_usuario 
FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE;

ALTER TABLE notificaciones 
ADD CONSTRAINT fk_notif_cita 
FOREIGN KEY (id_cita) REFERENCES citas(id_cita) ON DELETE CASCADE;

-- Paso 9: Rehabilitar foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Paso 10: Insertar datos de prueba
INSERT INTO citas (
    id_usuario_cliente, 
    id_servicio, 
    estado, 
    notas_cliente
) VALUES 
(1, 1, 'solicitud', 'Quiero un tatuaje pequeño en el brazo'),
(1, 2, 'programada', 'Tatuaje mediano en la espalda');

-- Verificaciones finales
SELECT 'ESTRUCTURA DE CITAS:' as Info;
DESCRIBE citas;

SELECT 'FOREIGN KEYS CREADAS:' as Info;
SELECT 
    CONSTRAINT_NAME as 'Constraint',
    COLUMN_NAME as 'Columna',
    REFERENCED_TABLE_NAME as 'Tabla Referenciada'
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'skincodeia' 
  AND TABLE_NAME IN ('citas', 'pagos', 'notificaciones')
  AND REFERENCED_TABLE_NAME IS NOT NULL;

SELECT 'DATOS DE PRUEBA:' as Info;
SELECT * FROM citas;

SELECT '✅ PROBLEMA RESUELTO DEFINITIVAMENTE' as Resultado;
