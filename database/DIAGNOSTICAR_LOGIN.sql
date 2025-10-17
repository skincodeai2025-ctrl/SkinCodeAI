-- ============================================
-- DIAGNOSTICAR PROBLEMA DE LOGIN
-- ============================================

USE skincodeia1;

-- 1. Verificar que la base de datos correcta está siendo usada
SELECT DATABASE() as 'Base de datos actual';

-- 2. Ver usuarios existentes
SELECT 'USUARIOS EN LA BASE DE DATOS:' as Info;
SELECT id_usuario, email, estado FROM usuarios;

-- 3. Ver credenciales actuales
SELECT 'CREDENCIALES ACTUALES:' as Info;
SELECT 
    c.id_usuario, 
    u.email,
    LEFT(c.hash_clave, 20) as 'hash_inicio',
    c.salt,
    LENGTH(c.hash_clave) as 'longitud_hash'
FROM credenciales c
JOIN usuarios u ON c.id_usuario = u.id_usuario;

-- 4. Ver roles asignados
SELECT 'ROLES ASIGNADOS:' as Info;
SELECT 
    u.email,
    r.nombre as rol
FROM usuarios u
LEFT JOIN usuario_roles ur ON u.id_usuario = ur.id_usuario
LEFT JOIN roles r ON ur.id_rol = r.id_rol;

-- 5. Verificar estructura de la consulta que usa la app
SELECT 'CONSULTA QUE USA LA APP:' as Info;
SELECT 
    u.id_usuario, 
    u.email, 
    u.estado, 
    c.hash_clave, 
    r.nombre AS rol
FROM usuarios u
LEFT JOIN credenciales c ON u.id_usuario = c.id_usuario
LEFT JOIN usuario_roles ur ON u.id_usuario = ur.id_usuario
LEFT JOIN roles r ON ur.id_rol = r.id_rol
WHERE u.email = 'cliente@test.com';

-- 6. Contar registros
SELECT 'CONTEO DE REGISTROS:' as Info;
SELECT 
    (SELECT COUNT(*) FROM usuarios) as usuarios,
    (SELECT COUNT(*) FROM credenciales) as credenciales,
    (SELECT COUNT(*) FROM usuario_roles) as usuario_roles;

SELECT '🔍 DIAGNÓSTICO COMPLETADO' as Resultado;
