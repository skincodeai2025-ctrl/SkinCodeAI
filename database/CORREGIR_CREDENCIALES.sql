-- ============================================
-- CORREGIR CREDENCIALES CON BCRYPT
-- ============================================

USE skincodeia1;

-- Verificar credenciales actuales
SELECT 'CREDENCIALES ACTUALES (INCORRECTAS):' as Info;
SELECT u.email, c.hash_clave, c.salt 
FROM usuarios u 
JOIN credenciales c ON u.id_usuario = c.id_usuario;

-- Eliminar credenciales incorrectas
DELETE FROM credenciales;

-- Insertar credenciales con hash bcrypt correcto para contraseña "123456"
-- Hash bcrypt de "123456": $2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi

INSERT INTO credenciales (id_usuario, hash_clave, salt) VALUES 
(1, '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'bcrypt_salt'),
(2, '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'bcrypt_salt'),
(3, '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'bcrypt_salt');

-- Verificar credenciales corregidas
SELECT 'CREDENCIALES CORREGIDAS:' as Info;
SELECT u.email, c.hash_clave, c.salt 
FROM usuarios u 
JOIN credenciales c ON u.id_usuario = c.id_usuario;

-- Verificar usuarios completos
SELECT 'USUARIOS PARA LOGIN:' as Info;
SELECT u.email, u.estado, r.nombre as rol
FROM usuarios u
LEFT JOIN usuario_roles ur ON u.id_usuario = ur.id_usuario
LEFT JOIN roles r ON ur.id_rol = r.id_rol;

SELECT '✅ CREDENCIALES CORREGIDAS CON BCRYPT' as Resultado;
SELECT 'Contraseña para todos: 123456' as Info;
