// ============================================
// GENERAR CREDENCIALES BCRYPT CORRECTAS
// ============================================

const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function generarCredenciales() {
  console.log('🔐 Generando credenciales con bcrypt...');
  
  // Generar hash para "123456"
  const password = '123456';
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  
  console.log(`Contraseña: ${password}`);
  console.log(`Hash bcrypt: ${hash}`);
  
  // Conectar a la base de datos
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'skincodeia1'
  });
  
  try {
    console.log('📊 Conectado a la base de datos');
    
    // Eliminar credenciales existentes
    await connection.execute('DELETE FROM credenciales');
    console.log('🗑️ Credenciales anteriores eliminadas');
    
    // Insertar nuevas credenciales
    const salt = await bcrypt.genSalt(saltRounds);
    
    for (let userId = 1; userId <= 3; userId++) {
      await connection.execute(
        'INSERT INTO credenciales (id_usuario, hash_clave, salt) VALUES (?, ?, ?)',
        [userId, hash, salt]
      );
    }
    
    console.log('✅ Nuevas credenciales insertadas');
    
    // Verificar usuarios
    const [users] = await connection.execute(`
      SELECT u.email, u.estado, r.nombre as rol
      FROM usuarios u
      LEFT JOIN usuario_roles ur ON u.id_usuario = ur.id_usuario
      LEFT JOIN roles r ON ur.id_rol = r.id_rol
    `);
    
    console.log('\n👥 Usuarios disponibles:');
    users.forEach(user => {
      console.log(`📧 ${user.email} | 🔑 123456 | 👤 ${user.rol} | 📊 ${user.estado}`);
    });
    
    // Probar autenticación
    console.log('\n🧪 Probando autenticación...');
    const testPassword = '123456';
    const isValid = await bcrypt.compare(testPassword, hash);
    console.log(`Validación de contraseña: ${isValid ? '✅ CORRECTA' : '❌ INCORRECTA'}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
    console.log('🔌 Conexión cerrada');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  generarCredenciales().catch(console.error);
}

module.exports = generarCredenciales;
