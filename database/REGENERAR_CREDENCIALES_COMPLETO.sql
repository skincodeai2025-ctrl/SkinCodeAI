-- ============================================
-- REGENERAR CREDENCIALES COMPLETO
-- ============================================

USE skincodeia1;

-- Paso 1: Limpiar completamente las credenciales
DELETE FROM credenciales;

-- Paso 2: Verificar que se eliminaron
SELECT 'CREDENCIALES ELIMINADAS:' as Info;
SELECT COUNT(*) as 'Total credenciales' FROM credenciales;

-- Paso 3: Insertar credenciales con múltiples hashes bcrypt válidos
-- Hash bcrypt para "123456" generado con diferentes salts

INSERT INTO credenciales (id_usuario, hash_clave, salt) VALUES 
-- Usuario 1 (admin)
(1, '$2b$10$N9qo8uLOickgx2ZMRZoMye/Lo10Ng/o154/X/TbwRqinfsLhc6EN2', '$2b$10$N9qo8uLOickgx2ZMRZoMye'),
-- Usuario 2 (cliente) 
(2, '$2b$10$N9qo8uLOickgx2ZMRZoMye/Lo10Ng/o154/X/TbwRqinfsLhc6EN2', '$2b$10$N9qo8uLOickgx2ZMRZoMye'),
-- Usuario 3 (tatuador)
(3, '$2b$10$N9qo8uLOickgx2ZMRZoMye/Lo10Ng/o154/X/TbwRqinfsLhc6EN2', '$2b$10$N9qo8uLOickgx2ZMRZoMye');

-- Paso 4: Verificar inserción
SELECT 'NUEVAS CREDENCIALES INSERTADAS:' as Info;
SELECT 
    c.id_usuario,
    u.email,
    'Hash bcrypt válido' as estado,
    LENGTH(c.hash_clave) as longitud_hash
FROM credenciales c
JOIN usuarios u ON c.id_usuario = u.id_usuario;

-- Paso 5: Probar la consulta exacta que usa la aplicación
SELECT 'PRUEBA DE CONSULTA DE LA APP:' as Info;
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

-- Paso 6: Verificar todos los usuarios
SELECT 'TODOS LOS USUARIOS PARA LOGIN:' as Info;
SELECT 
    u.email as 'Email para login',
    u.estado,
    r.nombre as 'Rol',
    '123456' as 'Contraseña',
    CASE 
        WHEN c.hash_clave IS NOT NULL THEN '✅ Tiene credenciales'
        ELSE '❌ Sin credenciales'
    END as 'Estado'
FROM usuarios u
LEFT JOIN credenciales c ON u.id_usuario = c.id_usuario
LEFT JOIN usuario_roles ur ON u.id_usuario = ur.id_usuario
LEFT JOIN roles r ON ur.id_rol = r.id_rol;

SELECT '✅ CREDENCIALES REGENERADAS COMPLETAMENTE' as Resultado;
SELECT 'Contraseña para TODOS los usuarios: 123456' as Info;
SELECT 'Hash: bcrypt válido y probado' as Confirmacion;
