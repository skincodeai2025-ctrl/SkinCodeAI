-- ============================================
-- VERIFICAR TABLAS CREADAS EN skincodeia1
-- ============================================

USE skincodeia1;

-- Ver todas las tablas creadas
SELECT 'TABLAS CREADAS EN skincodeia1:' as Info;
SHOW TABLES;

-- Contar tablas
SELECT COUNT(*) as 'Total de Tablas' 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = 'skincodeia1';

-- Ver estructura de cada tabla
SELECT 'ESTRUCTURA DE CADA TABLA:' as Info;

SELECT 'usuarios:' as Tabla;
DESCRIBE usuarios;

SELECT 'credenciales:' as Tabla;
DESCRIBE credenciales;

SELECT 'roles:' as Tabla;
DESCRIBE roles;

SELECT 'usuario_roles:' as Tabla;
DESCRIBE usuario_roles;

SELECT 'clientes:' as Tabla;
DESCRIBE clientes;

SELECT 'tatuadores:' as Tabla;
DESCRIBE tatuadores;

SELECT 'servicios:' as Tabla;
DESCRIBE servicios;

SELECT 'citas:' as Tabla;
DESCRIBE citas;

SELECT 'pagos:' as Tabla;
DESCRIBE pagos;

SELECT 'notificaciones:' as Tabla;
DESCRIBE notificaciones;

-- Verificar datos insertados
SELECT 'DATOS INSERTADOS:' as Info;
SELECT 
    (SELECT COUNT(*) FROM usuarios) as 'Usuarios',
    (SELECT COUNT(*) FROM roles) as 'Roles',
    (SELECT COUNT(*) FROM usuario_roles) as 'Usuario_Roles',
    (SELECT COUNT(*) FROM clientes) as 'Clientes',
    (SELECT COUNT(*) FROM tatuadores) as 'Tatuadores',
    (SELECT COUNT(*) FROM servicios) as 'Servicios',
    (SELECT COUNT(*) FROM citas) as 'Citas',
    (SELECT COUNT(*) FROM pagos) as 'Pagos',
    (SELECT COUNT(*) FROM notificaciones) as 'Notificaciones',
    (SELECT COUNT(*) FROM credenciales) as 'Credenciales';

-- Verificar que la columna problemática existe
SELECT 'VERIFICACIÓN DE COLUMNA PROBLEMÁTICA:' as Info;
SELECT COLUMN_NAME 
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'skincodeia1' 
  AND TABLE_NAME = 'citas'
  AND COLUMN_NAME = 'id_usuario_cliente';

SELECT '✅ VERIFICACIÓN COMPLETADA' as Resultado;
