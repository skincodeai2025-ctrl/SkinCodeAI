// Script para verificar la estructura de la tabla tatuadores
// Ejecutar con: node test-estructura-tatuadores.js

require('dotenv').config();
const mysql = require('mysql2/promise');

async function verificarEstructura() {
  let connection;
  
  try {
    // Crear conexión
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'skincodeia'
    });

    console.log('✅ Conectado a la base de datos\n');

    // Obtener estructura de la tabla
    const [columns] = await connection.execute(`
      DESCRIBE tatuadores
    `);

    console.log('📋 ESTRUCTURA DE LA TABLA TATUADORES:\n');
    console.log('┌─────────────────────┬──────────────┬──────┬─────┬─────────────┐');
    console.log('│ Campo               │ Tipo         │ Null │ Key │ Default     │');
    console.log('├─────────────────────┼──────────────┼──────┼─────┼─────────────┤');
    
    columns.forEach(col => {
      const field = col.Field.padEnd(19);
      const type = col.Type.padEnd(12);
      const nullVal = col.Null.padEnd(4);
      const key = col.Key.padEnd(3);
      const def = (col.Default || 'NULL').toString().padEnd(11);
      console.log(`│ ${field} │ ${type} │ ${nullVal} │ ${key} │ ${def} │`);
    });
    
    console.log('└─────────────────────┴──────────────┴──────┴─────┴─────────────┘\n');

    // Verificar campos específicos
    const camposBio = columns.filter(col => col.Field === 'bio');
    const camposCreado = columns.filter(col => col.Field === 'creado_en');

    console.log('🔍 VERIFICACIÓN DE CAMPOS:\n');
    console.log(`   Campo 'bio':       ${camposBio.length > 0 ? '✅ EXISTE' : '❌ NO EXISTE'}`);
    console.log(`   Campo 'creado_en': ${camposCreado.length > 0 ? '✅ EXISTE' : '❌ NO EXISTE'}\n`);

    // Contar registros
    const [count] = await connection.execute('SELECT COUNT(*) as total FROM tatuadores');
    console.log(`📊 Total de tatuadores registrados: ${count[0].total}\n`);

    // Si hay registros, mostrar uno de ejemplo
    if (count[0].total > 0) {
      const [sample] = await connection.execute('SELECT * FROM tatuadores LIMIT 1');
      console.log('📄 EJEMPLO DE REGISTRO:\n');
      console.log(JSON.stringify(sample[0], null, 2));
      console.log('');
    }

    // Recomendación
    console.log('💡 RECOMENDACIÓN:\n');
    if (camposBio.length === 0) {
      console.log('   El campo "bio" NO existe en tu tabla.');
      console.log('   Opciones:');
      console.log('   1. Agregar el campo ejecutando:');
      console.log('      ALTER TABLE tatuadores ADD COLUMN bio TEXT NULL AFTER especialidad;');
      console.log('   2. Usar el código actual que ya está corregido SIN el campo bio ✅');
    } else {
      console.log('   El campo "bio" SÍ existe en tu tabla.');
      console.log('   El código puede usar este campo para biografías de tatuadores.');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.code === 'ER_NO_SUCH_TABLE') {
      console.log('\n⚠️  La tabla "tatuadores" no existe.');
      console.log('   Ejecuta el script database/skincodeia.sql para crearla.');
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n✅ Conexión cerrada');
    }
  }
}

// Ejecutar
verificarEstructura();
