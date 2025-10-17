-- ============================================
-- DATOS DE EJEMPLO PARA REPORTES FINANCIEROS
-- ============================================

USE skincodeia1;

-- Agregar más servicios con precios variados
INSERT IGNORE INTO servicios (nombre, descripcion, precio, activo) VALUES
('Tatuaje Pequeño Color', 'Diseño pequeño con colores básicos. 1 hora.', 180000, 1),
('Tatuaje Mediano Detallado', 'Diseño con detalles finos. 3-4 horas.', 450000, 1),
('Tatuaje Grande Complejo', 'Diseño complejo en área grande. 6-8 horas.', 700000, 1),
('Tatuaje Manga Completa', 'Diseño completo de brazo. 10-15 horas.', 1200000, 1),
('Piercing Septum', 'Perforación en tabique nasal. Cicatrización: 6-8 semanas.', 50000, 1),
('Piercing Lengua', 'Perforación en lengua. Cicatrización: 4-6 semanas.', 55000, 1),
('Retoque Profesional', 'Retoque de tatuaje antiguo. 2-3 horas.', 200000, 1),
('Cover Up Pequeño', 'Cubrir tatuaje pequeño. 2-3 horas.', 250000, 1);

-- Crear más usuarios tatuadores
INSERT INTO usuarios (email, estado) VALUES
('tatuador2@skincodeia1.com', 'activo'),
('tatuador3@skincodeia1.com', 'activo');

INSERT INTO usuario_roles (id_usuario, id_rol) VALUES
(4, 2), -- tatuador2 = tatuador
(5, 2); -- tatuador3 = tatuador

INSERT INTO credenciales (id_usuario, hash_clave, salt) VALUES
(4, '$2b$10$N9qo8uLOickgx2ZMRZoMye/Lo10Ng/o154/X/TbwRqinfsLhc6EN2', '$2b$10$N9qo8uLOickgx2ZMRZoMye'),
(5, '$2b$10$N9qo8uLOickgx2ZMRZoMye/Lo10Ng/o154/X/TbwRqinfsLhc6EN2', '$2b$10$N9qo8uLOickgx2ZMRZoMye');

INSERT INTO tatuadores (id_usuario, nombre, especialidad, experiencia_anos, telefono) VALUES
(4, 'María', 'Realismo, Retrato', 3, '3012345678'),
(5, 'Andrés', 'Tradicional, Old School', 5, '3023456789');

-- Crear citas de ejemplo con diferentes fechas y precios
INSERT INTO citas (
    id_usuario_cliente, id_usuario_tatuador, id_servicio,
    estado, fecha_hora_inicio, precio, pago_estado, notas_cliente
) VALUES
-- Citas recientes (último mes)
(2, 3, 2, 'realizada', DATE_SUB(NOW(), INTERVAL 25 DAY), 150000, 'pagado', 'Tatuaje pequeño en brazo'),
(2, 4, 1, 'realizada', DATE_SUB(NOW(), INTERVAL 20 DAY), 80000, 'pagado', 'Símbolo pequeño'),
(2, 3, 3, 'realizada', DATE_SUB(NOW(), INTERVAL 15 DAY), 300000, 'pagado', 'Diseño mediano espalda'),
(2, 5, 5, 'realizada', DATE_SUB(NOW(), INTERVAL 12 DAY), 30000, 'pendiente', 'Piercing básico'),

-- Citas del mes anterior
(2, 3, 1, 'realizada', DATE_SUB(NOW(), INTERVAL 45 DAY), 80000, 'pagado', 'Tatuaje mini brazo'),
(2, 4, 2, 'realizada', DATE_SUB(NOW(), INTERVAL 40 DAY), 150000, 'pagado', 'Diseño pequeño colorido'),
(2, 3, 4, 'realizada', DATE_SUB(NOW(), INTERVAL 35 DAY), 500000, 'pagado', 'Tatuaje grande pierna'),
(2, 5, 6, 'realizada', DATE_SUB(NOW(), INTERVAL 30 DAY), 40000, 'pagado', 'Piercing helix'),

-- Citas más antiguas (2-3 meses atrás)
(2, 3, 3, 'realizada', DATE_SUB(NOW(), INTERVAL 75 DAY), 300000, 'pagado', 'Diseño complejo'),
(2, 4, 7, 'realizada', DATE_SUB(NOW(), INTERVAL 70 DAY), 450000, 'pagado', 'Diseño detallado'),
(2, 3, 8, 'realizada', DATE_SUB(NOW(), INTERVAL 65 DAY), 700000, 'pendiente', 'Manga completa'),
(2, 5, 9, 'realizada', DATE_SUB(NOW(), INTERVAL 60 DAY), 200000, 'pagado', 'Retoque profesional');

-- Crear algunos pagos de ejemplo
INSERT INTO pagos (id_cita, monto, metodo, estado, referencia) VALUES
(1, 150000, 'electronico', 'completado', 'REF001'),
(2, 80000, 'efectivo', 'completado', 'REF002'),
(3, 300000, 'electronico', 'completado', 'REF003'),
(5, 80000, 'efectivo', 'completado', 'REF004'),
(6, 150000, 'electronico', 'completado', 'REF005'),
(7, 500000, 'electronico', 'completado', 'REF006'),
(9, 300000, 'electronico', 'completado', 'REF007'),
(10, 450000, 'efectivo', 'completado', 'REF008'),
(11, 700000, 'electronico', 'pendiente', 'REF009'),
(12, 200000, 'efectivo', 'completado', 'REF010');

-- Verificar datos insertados
SELECT 'SERVICIOS ACTUALIZADOS:' as Info;
SELECT COUNT(*) as total_servicios FROM servicios WHERE activo = 1;

SELECT 'CITAS DE EJEMPLO CREADAS:' as Info;
SELECT COUNT(*) as total_citas FROM citas;

SELECT 'PAGOS DE EJEMPLO CREADOS:' as Info;
SELECT COUNT(*) as total_pagos FROM pagos;

-- Ver resumen financiero
SELECT 'RESUMEN FINANCIERO:' as Info;
SELECT
    SUM(precio) as ingresos_brutos,
    SUM(CASE WHEN pago_estado = 'pagado' THEN precio ELSE 0 END) as ingresos_pagados,
    SUM(CASE WHEN pago_estado = 'pendiente' THEN precio ELSE 0 END) as ingresos_pendientes,
    COUNT(*) as total_citas
FROM citas
WHERE estado = 'realizada';

SELECT '✅ DATOS DE EJEMPLO PARA REPORTES FINANCIEROS CREADOS' as Resultado;
