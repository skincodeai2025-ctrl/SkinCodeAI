# 🔔 Instalación del Sistema de Notificaciones

## Pasos de Instalación

### 1. Crear la tabla de notificaciones

Ejecuta el script de inicialización:

```bash
node scripts/init-notificaciones.js
```

O ejecuta manualmente esta SQL en tu base de datos:

```sql
CREATE TABLE IF NOT EXISTS notificaciones (
  id_notificacion INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  tipo ENUM('info', 'success', 'warning', 'error', 'cita') DEFAULT 'info',
  titulo VARCHAR(255) NOT NULL,
  mensaje TEXT,
  id_cita INT NULL,
  leida BOOLEAN DEFAULT FALSE,
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  fecha_lectura DATETIME NULL,
  INDEX idx_usuario (id_usuario),
  INDEX idx_leida (leida),
  INDEX idx_fecha (fecha_creacion),
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  FOREIGN KEY (id_cita) REFERENCES citas(id_cita) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 2. Reiniciar el servidor

```bash
npm run dev
```

O si usas nodemon:

```bash
nodemon server.js
```

### 3. Verificar que funciona

1. **Login** en la aplicación
2. Ve al **Dashboard**
3. Deberías ver la **campana de notificaciones** 🔔 en el navbar
4. Crea una **nueva cita** o cambia el estado de una existente
5. Verás aparecer una **notificación**

---

## ✅ Checklist de Verificación

- [ ] Tabla `notificaciones` creada en la base de datos
- [ ] Servidor reiniciado
- [ ] Campana aparece en el navbar del dashboard
- [ ] Badge muestra "0" o el número de notificaciones
- [ ] Al hacer clic en la campana se abre el panel
- [ ] Al crear/modificar una cita se genera notificación
- [ ] Toast aparece cuando hay nuevas notificaciones
- [ ] Página `/notificaciones.html` funciona

---

## 🔧 Troubleshooting

### La campana no aparece
**Solución**: Verifica que `js/notificaciones.js` esté cargado en el HTML:
```html
<script src="js/notificaciones.js"></script>
```

### Error "Table doesn't exist"
**Solución**: Ejecuta el script de inicialización:
```bash
node scripts/init-notificaciones.js
```

### Las notificaciones no se crean
**Solución**: Verifica que el controlador de citas esté importando el modelo:
```javascript
const Notificaciones = require('../models/Notificaciones');
```

### El contador no se actualiza
**Solución**: 
1. Verifica que el token esté en localStorage
2. Abre la consola del navegador y busca errores
3. Verifica que la ruta `/api/notificaciones/count` funcione

### Error de CORS
**Solución**: Verifica que CORS esté habilitado en `server.js`:
```javascript
app.use(cors());
```

---

## 🎯 Pruebas Rápidas

### Crear notificación de prueba (SQL)
```sql
INSERT INTO notificaciones (id_usuario, tipo, titulo, mensaje, leida)
VALUES (1, 'info', 'Notificación de prueba', 'Este es un mensaje de prueba', FALSE);
```

### Crear notificación desde código
```javascript
const Notificaciones = require('./src/models/Notificaciones');

await Notificaciones.create({
  id_usuario: 1,
  tipo: 'success',
  titulo: 'Prueba exitosa',
  mensaje: 'El sistema de notificaciones funciona correctamente',
  leida: false
});
```

### Probar endpoint desde navegador
```
GET http://localhost:3000/api/notificaciones/count
```

---

## 📊 Monitoreo

### Ver todas las notificaciones en BD
```sql
SELECT * FROM notificaciones ORDER BY fecha_creacion DESC LIMIT 20;
```

### Contar notificaciones por usuario
```sql
SELECT id_usuario, COUNT(*) as total, SUM(leida = 0) as no_leidas
FROM notificaciones
GROUP BY id_usuario;
```

### Ver notificaciones de citas
```sql
SELECT n.*, c.estado as cita_estado
FROM notificaciones n
LEFT JOIN citas c ON c.id_cita = n.id_cita
WHERE n.tipo = 'cita'
ORDER BY n.fecha_creacion DESC;
```

---

## 🚀 Próximos Pasos

Una vez instalado y funcionando:

1. **Personaliza los mensajes** en `src/models/Notificaciones.js`
2. **Ajusta el intervalo de polling** en `public/js/notificaciones.js` (línea 8)
3. **Agrega más tipos de notificaciones** según tus necesidades
4. **Implementa WebSockets** para notificaciones en tiempo real
5. **Agrega notificaciones por email** para eventos importantes

---

## 📝 Notas Importantes

- Las notificaciones se crean **automáticamente** al cambiar el estado de una cita
- El sistema usa **polling cada 30 segundos** (no tiempo real con WebSockets)
- Las notificaciones se **eliminan en cascada** si se elimina el usuario
- Si se elimina una cita, el `id_cita` se pone en **NULL** (no se elimina la notificación)
- La tabla se **crea automáticamente** si no existe al hacer la primera consulta

---

## 🎉 ¡Listo!

El sistema de notificaciones está instalado y funcionando. Los usuarios ahora recibirán notificaciones automáticas cuando:

- ✅ Se crea una nueva solicitud de cita
- ✅ Se programa una cita
- ✅ Se confirma una cita
- ✅ Se cancela una cita
- ✅ Se completa una cita

**Disfruta del nuevo sistema de notificaciones!** 🔔
