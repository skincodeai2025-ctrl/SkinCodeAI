-- ============================================
-- RECREAR BASE DE DATOS COMPLETA - skincodeia1
-- ============================================

-- Paso 1: Eliminar base de datos existente
-- DROP DATABASE IF EXISTS skincodeia1;

-- Paso 2: Crear base de datos nueva
CREATE DATABASE skincodeia1 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Paso 3: Usar la nueva base de datos
USE skincodeia1;

-- ============================================
-- CREAR TODAS LAS TABLAS DESDE CERO
-- ============================================

-- Tabla: usuarios
CREATE TABLE usuarios (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(150) NOT NULL UNIQUE,
  estado ENUM('activo','inactivo') NOT NULL DEFAULT 'activo',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: credenciales
CREATE TABLE credenciales (
  id_usuario INT PRIMARY KEY,
  hash_clave VARCHAR(255) NOT NULL,
  salt VARCHAR(255) NOT NULL,
  actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_credenciales_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: roles
CREATE TABLE roles (
  id_rol INT AUTO_INCREMENT PRIMARY KEY,
  nombre ENUM('cliente','tatuador','soporte') NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: usuario_roles
CREATE TABLE usuario_roles (
  id_usuario INT NOT NULL,
  id_rol INT NOT NULL,
  PRIMARY KEY (id_usuario, id_rol),
  CONSTRAINT fk_usuario_roles_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  CONSTRAINT fk_usuario_roles_rol FOREIGN KEY (id_rol) REFERENCES roles(id_rol) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: clientes
CREATE TABLE clientes (
  id_cliente INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL,
  primer_apellido VARCHAR(100) NULL,
  segundo_apellido VARCHAR(100) NULL,
  telefono VARCHAR(20) NULL,
  direccion TEXT NULL,
  fecha_naci DATE NULL,
  nickname VARCHAR(50) NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_clientes_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: tatuadores
CREATE TABLE tatuadores (
  id_tatuador INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL,
  especialidades TEXT NULL,
  experiencia_anos INT NULL,
  portfolio_url VARCHAR(300) NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_tatuadores_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: servicios
CREATE TABLE servicios (
  id_servicio INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  descripcion TEXT NULL,
  precio DECIMAL(10,2) NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: citas (CON LA ESTRUCTURA CORRECTA)
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

-- Tabla: pagos
CREATE TABLE pagos (
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

-- Tabla: notificaciones
CREATE TABLE notificaciones (
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

-- ============================================
-- CREAR ÍNDICES PARA MEJORAR RENDIMIENTO
-- ============================================

-- Índices para citas
CREATE INDEX idx_citas_cliente ON citas(id_usuario_cliente);
CREATE INDEX idx_citas_tatuador ON citas(id_usuario_tatuador);
CREATE INDEX idx_citas_estado ON citas(estado);
CREATE INDEX idx_citas_fecha_inicio ON citas(fecha_hora_inicio);

-- Índices para pagos
CREATE INDEX idx_pagos_cita ON pagos(id_cita);
CREATE INDEX idx_pagos_estado ON pagos(estado);
CREATE INDEX idx_pagos_fecha ON pagos(fecha_pago);

-- Índices para notificaciones
CREATE INDEX idx_notif_usuario ON notificaciones(id_usuario);
CREATE INDEX idx_notif_leida ON notificaciones(leida);
CREATE INDEX idx_notif_cita ON notificaciones(id_cita);
CREATE INDEX idx_notif_tipo ON notificaciones(tipo);

-- Índices para clientes
CREATE INDEX idx_clientes_usuario ON clientes(id_usuario);
CREATE INDEX idx_clientes_nombre ON clientes(nombre);

-- Índices para tatuadores
CREATE INDEX idx_tatuadores_usuario ON tatuadores(id_usuario);
CREATE INDEX idx_tatuadores_activo ON tatuadores(activo);

-- Índices para servicios
CREATE INDEX idx_servicios_activo ON servicios(activo);
CREATE INDEX idx_servicios_nombre ON servicios(nombre);

-- ============================================
-- INSERTAR DATOS INICIALES
-- ============================================

-- Insertar roles básicos
INSERT INTO roles (nombre) VALUES 
('cliente'),
('tatuador'),
('soporte');

-- Insertar usuario de prueba
INSERT INTO usuarios (email, estado) VALUES 
('admin@skincodeia1.com', 'activo'),
('cliente@test.com', 'activo'),
('tatuador@test.com', 'activo');

-- Asignar roles
INSERT INTO usuario_roles (id_usuario, id_rol) VALUES 
(1, 3), -- admin = soporte
(2, 1), -- cliente = cliente
(3, 2); -- tatuador = tatuador

-- Insertar credenciales de prueba (contraseña: "123456")
INSERT INTO credenciales (id_usuario, hash_clave, salt) VALUES 
(1, 'e10adc3949ba59abbe56e057f20f883e', 'salt123'),
(2, 'e10adc3949ba59abbe56e057f20f883e', 'salt123'),
(3, 'e10adc3949ba59abbe56e057f20f883e', 'salt123');

-- Insertar cliente de prueba
INSERT INTO clientes (id_usuario, nombre, primer_apellido, telefono, fecha_naci) VALUES 
(2, 'Juan', 'Pérez', '3001234567', '1990-05-15');

-- Insertar tatuador de prueba
INSERT INTO tatuadores (id_usuario, nombre, especialidades, experiencia_anos) VALUES 
(3, 'Carlos', 'Realismo, Tradicional', 5);

-- Insertar servicios básicos
INSERT INTO servicios (nombre, descripcion, precio, activo) VALUES 
('Tatuaje Mini (2-5cm)', 'Diseño muy pequeño, símbolos o letras. 30-60 min.', 80000, 1),
('Tatuaje Pequeño (5-10cm)', 'Diseño simple en muñeca, tobillo. 1-2 horas.', 150000, 1),
('Tatuaje Mediano (10-20cm)', 'Diseño con detalle en brazo o pierna. 2-4 horas.', 300000, 1),
('Piercing Lóbulo', 'Perforación básica en lóbulo de oreja. Cicatrización: 1-2 meses.', 30000, 1),
('Piercing Helix', 'Perforación en cartílago superior. Cicatrización: 3-6 meses.', 40000, 1);

-- Insertar citas de prueba
INSERT INTO citas (
    id_usuario_cliente, 
    id_usuario_tatuador,
    id_servicio, 
    estado, 
    notas_cliente,
    precio
) VALUES 
(2, 3, 1, 'solicitud', 'Quiero un tatuaje pequeño en el brazo', 80000),
(2, NULL, 2, 'programada', 'Tatuaje mediano en la espalda', 150000);

-- ============================================
-- VERIFICACIONES FINALES
-- ============================================

-- Mostrar todas las tablas creadas
SELECT 'TABLAS CREADAS:' as Info;
SHOW TABLES;

-- Verificar estructura de citas
SELECT 'ESTRUCTURA DE CITAS:' as Info;
DESCRIBE citas;

-- Verificar foreign keys
SELECT 'FOREIGN KEYS:' as Info;
SELECT 
    TABLE_NAME as 'Tabla',
    CONSTRAINT_NAME as 'Constraint',
    COLUMN_NAME as 'Columna',
    REFERENCED_TABLE_NAME as 'Referencia'
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'skincodeia1' 
  AND REFERENCED_TABLE_NAME IS NOT NULL
ORDER BY TABLE_NAME, CONSTRAINT_NAME;

-- Contar registros
SELECT 'DATOS INSERTADOS:' as Info;
SELECT 
    (SELECT COUNT(*) FROM usuarios) as 'Usuarios',
    (SELECT COUNT(*) FROM roles) as 'Roles',
    (SELECT COUNT(*) FROM servicios) as 'Servicios',
    (SELECT COUNT(*) FROM citas) as 'Citas',
    (SELECT COUNT(*) FROM clientes) as 'Clientes',
    (SELECT COUNT(*) FROM tatuadores) as 'Tatuadores';

-- Verificar datos de citas
SELECT 'CITAS DE PRUEBA:' as Info;
SELECT 
    c.id_cita,
    u.email as cliente_email,
    s.nombre as servicio,
    c.estado,
    c.precio,
    c.notas_cliente
FROM citas c
JOIN usuarios u ON c.id_usuario_cliente = u.id_usuario
LEFT JOIN servicios s ON c.id_servicio = s.id_servicio;

-- RESULTADO FINAL
SELECT '🎉 BASE DE DATOS RECREADA COMPLETAMENTE' as Resultado;
SELECT 'Todas las tablas creadas con estructura correcta' as Info;
SELECT 'Datos de prueba insertados correctamente' as Confirmacion;
SELECT 'La columna id_usuario_cliente existe en citas' as Solucion;
