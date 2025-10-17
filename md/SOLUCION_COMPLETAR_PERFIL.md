# 🔧 Solución: Error "No se pudo conectar con el servidor"

## 🎯 Problema Identificado

Al intentar guardar el perfil desde `completar-perfil.html`, aparecía el error:
```
"No se pudo conectar con el servidor"
```

---

## 🔍 Causas del Error

### 1. **Ruta Incorrecta**
- ❌ **Formulario enviaba a**: `/api/usuarios/perfil` (PUT)
- ✅ **Ruta configurada**: `/api/perfil/completar` (POST)

### 2. **Método HTTP Incorrecto**
- ❌ **Formulario usaba**: `PUT`
- ✅ **Ruta espera**: `POST`

### 3. **Nombres de Campos Diferentes**
- ❌ **Formulario enviaba**: `fecha_nacimiento`
- ✅ **Controlador esperaba**: `fecha_naci`

---

## ✅ Soluciones Aplicadas

### 1. **Actualizar Ruta en el Formulario**

**Archivo**: `public/completar-perfil.html`

```javascript
// ❌ ANTES
const response = await fetch('/api/usuarios/perfil', {
  method: 'PUT',
  // ...
});

// ✅ AHORA
const response = await fetch('/api/perfil/completar', {
  method: 'POST',
  // ...
});
```

### 2. **Actualizar Controlador para Aceptar Ambos Formatos**

**Archivo**: `src/controllers/perfilController.js`

```javascript
// ✅ Ahora acepta ambos nombres de campo
const { 
  nombre, 
  fecha_naci,           // ← Formato antiguo
  fecha_nacimiento,     // ← Formato nuevo
  primer_apellido, 
  segundo_apellido, 
  telefono, 
  direccion, 
  ciudad,              // ← Nuevo campo
  pais,                // ← Nuevo campo
  nickname 
} = req.body;

// Usar el campo que venga
const fechaNaci = fecha_naci || fecha_nacimiento;
```

---

## 📋 Configuración de Rutas

### Servidor (`server.js`)
```javascript
app.use('/api/perfil', require('./src/routes/perfil'));
```

### Ruta (`src/routes/perfil.js`)
```javascript
router.post('/completar', auth, ctrl.completarPerfil);
```

### URL Final
```
POST /api/perfil/completar
```

---

## 🔧 Campos Aceptados

### Campos Requeridos
- ✅ `nombre` (string)
- ✅ `fecha_nacimiento` o `fecha_naci` (date, formato YYYY-MM-DD)
- ✅ `telefono` (string)
- ✅ `primer_apellido` (string)

### Campos Opcionales
- ⚪ `segundo_apellido` (string)
- ⚪ `direccion` (string)
- ⚪ `ciudad` (string)
- ⚪ `pais` (string)
- ⚪ `nickname` (string)

---

## 📊 Flujo Completo

### 1. Usuario Completa Formulario
```
Nombre: Juan
Primer Apellido: Pérez
Fecha Nacimiento: 1990-05-15
Teléfono: +57 300 123 4567
Ciudad: Bogotá
País: Colombia
```

### 2. Frontend Envía Request
```javascript
POST /api/perfil/completar
Headers: {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer <token>'
}
Body: {
  nombre: "Juan",
  primer_apellido: "Pérez",
  fecha_nacimiento: "1990-05-15",
  telefono: "+57 300 123 4567",
  ciudad: "Bogotá",
  pais: "Colombia"
}
```

### 3. Backend Valida
- ✅ Token válido (middleware auth)
- ✅ Nombre presente
- ✅ Fecha de nacimiento válida
- ✅ Usuario mayor de 18 años

### 4. Backend Guarda en BD
```sql
INSERT INTO clientes (
  id_usuario, nombre, primer_apellido, segundo_apellido,
  telefono, direccion, fecha_naci, nickname
) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
```

### 5. Backend Responde
```json
{
  "message": "Perfil completado exitosamente. Bienvenido/a!",
  "necesitaPerfil": false
}
```

### 6. Frontend Redirige
```javascript
setTimeout(() => {
  window.location.href = 'dashboard.html';
}, 1500);
```

---

## ✅ Verificación

### Probar el Flujo

1. **Iniciar servidor**:
```bash
npm run dev
```

2. **Abrir navegador**:
```
http://localhost:3000/completar-perfil.html
```

3. **Verificar token**:
- Abrir DevTools → Application → Local Storage
- Debe existir `token`

4. **Completar formulario**:
- Llenar todos los campos requeridos
- Click en "Guardar y Continuar"

5. **Verificar respuesta**:
- Abrir DevTools → Network
- Ver request a `/api/perfil/completar`
- Status: 200 OK
- Response: `{ message: "...", necesitaPerfil: false }`

6. **Verificar redirección**:
- Debe redirigir a `dashboard.html`

---

## 🚨 Errores Posibles y Soluciones

### Error 401: Unauthorized
**Causa**: Token inválido o expirado
**Solución**: 
```javascript
// Verificar que el token existe
const token = localStorage.getItem('token');
if (!token) {
  window.location.href = 'login.html';
}
```

### Error 400: Nombre y fecha obligatorios
**Causa**: Campos requeridos vacíos
**Solución**: Verificar que los campos tienen `required` en HTML

### Error 403: Menor de 18 años
**Causa**: Fecha de nacimiento indica edad < 18
**Solución**: Usuario debe ser mayor de edad

### Error 409: Perfil ya completado
**Causa**: Ya existe registro en tabla `clientes`
**Solución**: Redirigir directamente a dashboard

### Error 500: No se pudo guardar
**Causa**: Error en base de datos
**Solución**: Verificar:
- Conexión a MySQL
- Tabla `clientes` existe
- Campos coinciden con la estructura

---

## 📊 Estructura de la Tabla

```sql
CREATE TABLE clientes (
  id_cliente INT PRIMARY KEY AUTO_INCREMENT,
  id_usuario INT NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL,
  primer_apellido VARCHAR(100),
  segundo_apellido VARCHAR(100),
  telefono VARCHAR(20),
  direccion VARCHAR(255),
  fecha_naci DATE NOT NULL,
  nickname VARCHAR(50),
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);
```

---

## ✅ Resultado Final

Después de aplicar estos cambios:

✅ **Ruta correcta**: `/api/perfil/completar` (POST)
✅ **Método correcto**: POST
✅ **Campos compatibles**: Acepta `fecha_nacimiento` y `fecha_naci`
✅ **Validaciones**: Edad, formato de fecha
✅ **Respuesta**: JSON con mensaje de éxito
✅ **Redirección**: A dashboard después de 1.5s

**¡El formulario de completar perfil ahora funciona correctamente!** 🚀

---

## 🔍 Debug en Consola

Si aún hay problemas, verificar en DevTools:

```javascript
// Ver request
console.log('Enviando a:', '/api/perfil/completar');
console.log('Token:', localStorage.getItem('token'));
console.log('Datos:', formData);

// Ver response
console.log('Status:', response.status);
console.log('Data:', data);
```

---

**Fecha**: Octubre 14, 2025  
**Versión**: 1.0.0  
**Estado**: ✅ Solucionado
