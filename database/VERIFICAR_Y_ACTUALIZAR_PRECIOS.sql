-- ============================================
-- VERIFICAR Y ACTUALIZAR PRECIOS DE SERVICIOS
-- ============================================

USE skincodeia1;

-- Ver servicios actuales
SELECT 'SERVICIOS ACTUALES:' as Info;
SELECT id_servicio, nombre, descripcion, precio, activo FROM servicios;

-- Actualizar precios si están en NULL o 0
UPDATE servicios SET precio = 80000 WHERE nombre LIKE '%Mini%' AND (precio IS NULL OR precio = 0);
UPDATE servicios SET precio = 150000 WHERE nombre LIKE '%Pequeño%' AND (precio IS NULL OR precio = 0);
UPDATE servicios SET precio = 300000 WHERE nombre LIKE '%Mediano%' AND (precio IS NULL OR precio = 0);
UPDATE servicios SET precio = 500000 WHERE nombre LIKE '%Grande%' AND (precio IS NULL OR precio = 0);
UPDATE servicios SET precio = 30000 WHERE nombre LIKE '%Piercing Lóbulo%' AND (precio IS NULL OR precio = 0);
UPDATE servicios SET precio = 40000 WHERE nombre LIKE '%Piercing Helix%' AND (precio IS NULL OR precio = 0);

-- Insertar servicios adicionales si no existen
INSERT IGNORE INTO servicios (nombre, descripcion, precio, activo) VALUES 
('Tatuaje Grande (20-30cm)', 'Diseño complejo en brazo completo o espalda. 4-8 horas.', 500000, 1),
('Tatuaje Extra Grande (+30cm)', 'Diseño muy complejo, manga completa. 8+ horas.', 800000, 1),
('Piercing Tragus', 'Perforación en cartílago del tragus. Cicatrización: 3-6 meses.', 45000, 1),
('Piercing Industrial', 'Perforación doble conectada con barra. Cicatrización: 6-12 meses.', 60000, 1),
('Retoque de Tatuaje', 'Retoque o reparación de tatuaje existente. 1-2 horas.', 100000, 1);

-- Ver servicios actualizados
SELECT 'SERVICIOS ACTUALIZADOS:' as Info;
SELECT 
    id_servicio, 
    nombre, 
    CONCAT('$', FORMAT(precio, 0)) as precio_formateado,
    precio,
    activo 
FROM servicios 
ORDER BY precio ASC;

-- Verificar citas existentes con precios
SELECT 'CITAS CON PRECIOS:' as Info;
SELECT 
    c.id_cita,
    s.nombre as servicio,
    s.precio as precio_servicio,
    c.precio as precio_cita,
    CASE 
        WHEN c.precio IS NULL THEN '❌ Sin precio'
        WHEN c.precio = s.precio THEN '✅ Precio correcto'
        ELSE '⚠️ Precio diferente'
    END as estado_precio
FROM citas c
LEFT JOIN servicios s ON c.id_servicio = s.id_servicio;

SELECT '✅ PRECIOS VERIFICADOS Y ACTUALIZADOS' as Resultado;
