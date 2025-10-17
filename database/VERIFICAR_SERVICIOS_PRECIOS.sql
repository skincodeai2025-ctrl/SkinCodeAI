-- ============================================
-- VERIFICAR SERVICIOS Y PRECIOS
-- ============================================

USE skincodeia1;

-- Ver todos los servicios con sus precios
SELECT 'SERVICIOS DISPONIBLES:' as Info;
SELECT 
    id_servicio,
    nombre,
    descripcion,
    precio,
    activo
FROM servicios
ORDER BY id_servicio;

-- Ver estructura de la tabla servicios
SELECT 'ESTRUCTURA DE SERVICIOS:' as Info;
DESCRIBE servicios;

-- Ver estructura de la tabla citas
SELECT 'ESTRUCTURA DE CITAS:' as Info;
DESCRIBE citas;

-- Ver citas existentes con información de servicios
SELECT 'CITAS CON SERVICIOS:' as Info;
SELECT 
    c.id_cita,
    c.id_servicio,
    s.nombre as servicio_nombre,
    s.precio as servicio_precio,
    c.precio as cita_precio,
    c.estado,
    c.notas_cliente
FROM citas c
LEFT JOIN servicios s ON c.id_servicio = s.id_servicio
ORDER BY c.id_cita;

SELECT '🔍 DIAGNÓSTICO DE PRECIOS COMPLETADO' as Resultado;
