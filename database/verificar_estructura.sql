-- ============================================
-- VERIFICAR Y CORREGIR ESTRUCTURA DE TABLAS
-- ============================================

USE skincodeia;

-- Ver estructura de la tabla citas
DESCRIBE citas;

-- Ver todas las columnas de citas
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_KEY, EXTRA
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'skincodeia' AND TABLE_NAME = 'citas'
ORDER BY ORDINAL_POSITION;

-- Ver estructura de usuarios
DESCRIBE usuarios;

-- Ver columnas de usuarios
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'skincodeia' AND TABLE_NAME = 'usuarios'
ORDER BY ORDINAL_POSITION;

-- Si la tabla citas tiene estructura incorrecta, eliminarla y recrearla
-- DESCOMENTA ESTAS LÍNEAS SOLO SI ES NECESARIO:

/*
DROP TABLE IF EXISTS citas;

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
*/
