-- Schema for skincodeia CRM (MySQL/MariaDB)
CREATE DATABASE IF NOT EXISTS skincodeia CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE skincodeia;

-- Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(150) NOT NULL UNIQUE,
  estado ENUM('activo','inactivo') NOT NULL DEFAULT 'activo',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Credenciales
CREATE TABLE IF NOT EXISTS credenciales (
  id_usuario INT PRIMARY KEY,
  hash_clave VARCHAR(255) NOT NULL,
  salt VARCHAR(255) NOT NULL,
  actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_credenciales_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Roles
CREATE TABLE IF NOT EXISTS roles (
  id_rol INT AUTO_INCREMENT PRIMARY KEY,
  nombre ENUM('cliente','tatuador','soporte') NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS usuario_roles (
  id_usuario INT NOT NULL,
  id_rol INT NOT NULL,
  PRIMARY KEY (id_usuario, id_rol),
  CONSTRAINT fk_ur_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  CONSTRAINT fk_ur_rol FOREIGN KEY (id_rol) REFERENCES roles(id_rol) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Clientes
CREATE TABLE IF NOT EXISTS clientes (
  id_usuario INT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  primer_apellido VARCHAR(100) DEFAULT '',
  segundo_apellido VARCHAR(100) DEFAULT '',
  telefono VARCHAR(30) DEFAULT '',
  direccion VARCHAR(200) DEFAULT '',
  fecha_naci DATE NOT NULL,
  nickname VARCHAR(80) NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_clientes_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tatuadores
CREATE TABLE IF NOT EXISTS tatuadores (
  id_usuario INT PRIMARY KEY,
  nombre_artistico VARCHAR(120) NOT NULL,
  nombre_real VARCHAR(200) NULL,
  especialidad VARCHAR(150) NULL,
  bio TEXT NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_tatuadores_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Servicios
CREATE TABLE IF NOT EXISTS servicios (
  id_servicio INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  descripcion TEXT NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Citas
CREATE TABLE IF NOT EXISTS citas (
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
  CONSTRAINT fk_citas_cliente FOREIGN KEY (id_usuario_cliente) REFERENCES usuarios(id_usuario),
  CONSTRAINT fk_citas_tatuador FOREIGN KEY (id_usuario_tatuador) REFERENCES usuarios(id_usuario),
  CONSTRAINT fk_citas_servicio FOREIGN KEY (id_servicio) REFERENCES servicios(id_servicio)
) ENGINE=InnoDB;

-- Pagos (histórico por cita)
CREATE TABLE IF NOT EXISTS pagos (
  id_pago INT AUTO_INCREMENT PRIMARY KEY,
  id_cita INT NOT NULL,
  monto DECIMAL(10,2) NOT NULL,
  metodo ENUM('efectivo','electronico','bitcoin') NOT NULL DEFAULT 'efectivo',
  referencia VARCHAR(200) NULL,
  fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_pagos_cita FOREIGN KEY (id_cita) REFERENCES citas(id_cita) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tatuajes registrados por clientes
CREATE TABLE IF NOT EXISTS tatuajes_cliente (
  id_tatuaje_cliente INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario_cliente INT NOT NULL,
  ubicacion_cuerpo VARCHAR(120) NULL,
  descripcion TEXT NULL,
  fecha_realizacion DATE NULL,
  nombre_tatuador VARCHAR(150) NULL,
  url_imagen VARCHAR(300) NULL,
  categoria ENUM('ninguno','linea_fina','realismo','tradicional','acuarela','geometrico') DEFAULT 'ninguno',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_tat_cli_cliente FOREIGN KEY (id_usuario_cliente) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Seeds
INSERT IGNORE INTO roles (id_rol, nombre) VALUES
  (1,'cliente'), (2,'tatuador'), (3,'soporte');

INSERT INTO servicios (nombre, descripcion, activo) VALUES
  ('Tatuaje pequeño', 'Hasta 5cm', 1),
  ('Tatuaje mediano', 'Hasta 10cm', 1),
  ('Tatuaje grande', 'Más de 10cm', 1)
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);
