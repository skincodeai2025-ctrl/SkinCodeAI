-- ============================================
-- VERIFICAR USUARIOS Y CREDENCIALES
-- ============================================

USE skincodeia1;

-- Ver todos los usuarios
SELECT 'USUARIOS REGISTRADOS:' as Info;
SELECT id_usuario, email, estado, creado_en FROM usuarios;

-- Ver credenciales
SELECT 'CREDENCIALES:' as Info;
SELECT c.id_usuario, u.email, c.hash_clave, c.salt 
FROM credenciales c
JOIN usuarios u ON c.id_usuario = u.id_usuario;

-- Ver roles asignados
SELECT 'ROLES ASIGNADOS:' as Info;
SELECT u.email, r.nombre as rol
FROM usuarios u
JOIN usuario_roles ur ON u.id_usuario = ur.id_usuario
JOIN roles r ON ur.id_rol = r.id_rol;

-- Verificar que las tablas existen
SELECT 'TABLAS EXISTENTES:' as Info;
SHOW TABLES;

-- Contar registros
SELECT 'CONTEO DE REGISTROS:' as Info;
SELECT 
    (SELECT COUNT(*) FROM usuarios) as usuarios,
    (SELECT COUNT(*) FROM credenciales) as credenciales,
    (SELECT COUNT(*) FROM roles) as roles,
    (SELECT COUNT(*) FROM usuario_roles) as usuario_roles;

SELECT '✅ VERIFICACIÓN COMPLETADA' as Resultado;
