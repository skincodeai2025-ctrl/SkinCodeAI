# 🔧 Solución: Puerto 3000 en Uso

## ❌ Problema

```
Error: listen EADDRINUSE: address already in use :::3000
```

Este error ocurre cuando intentas iniciar el servidor Node.js pero el puerto 3000 ya está siendo usado por otro proceso.

---

## 🎯 Causas Comunes

1. **Servidor Node.js anterior no se cerró correctamente**
   - Cerraste la terminal pero el proceso siguió corriendo
   - Nodemon se quedó colgado

2. **Múltiples instancias de nodemon**
   - Ejecutaste `npm run dev` varias veces
   - Nodemon reinició pero el proceso anterior no murió

3. **Otro servidor usando el puerto 3000**
   - Otro proyecto Node.js
   - Otro servicio (React, Vue, etc.)

---

## ✅ Soluciones

### Solución 1: Script Automático (Recomendado)

He creado un archivo `kill-port-3000.bat` que hace todo automáticamente:

```bash
# Doble click en el archivo:
kill-port-3000.bat

# O desde la terminal:
.\kill-port-3000.bat
```

---

### Solución 2: Comandos Manuales

#### Paso 1: Encontrar el proceso

```bash
netstat -ano | findstr :3000
```

Resultado:
```
TCP    0.0.0.0:3000           0.0.0.0:0              LISTENING       10996
TCP    [::]:3000              [::]:0                 LISTENING       10996
```

El número al final (10996) es el **PID** (Process ID).

#### Paso 2: Verificar qué proceso es

```bash
tasklist | findstr 10996
```

Resultado:
```
node.exe                     10996 Console                    1     57.276 K
```

#### Paso 3: Matar el proceso

```bash
taskkill /F /PID 10996
```

Resultado:
```
SUCCESS: The process with PID 10996 has been terminated.
```

#### Paso 4: Verificar que el puerto esté libre

```bash
netstat -ano | findstr :3000
```

Si no muestra nada, el puerto está libre.

---

### Solución 3: Matar TODOS los procesos Node.js

⚠️ **CUIDADO**: Esto cerrará TODOS los procesos de Node.js en tu sistema.

```bash
taskkill /F /IM node.exe
```

---

### Solución 4: Cambiar el Puerto

Si no puedes liberar el puerto 3000, cambia el puerto del servidor:

#### Editar `server.js`:

```javascript
// Antes:
const PORT = 3000;

// Después:
const PORT = process.env.PORT || 3001;
```

Luego inicia el servidor:
```bash
npm run dev
```

El servidor correrá en `http://localhost:3001`

---

## 🚀 Prevención

### 1. Cerrar Correctamente el Servidor

En la terminal donde corre el servidor:
- Presiona `Ctrl + C` (una o dos veces)
- Espera a que diga "Servidor detenido"
- Cierra la terminal

### 2. Usar un Solo Terminal

- No ejecutes `npm run dev` en múltiples terminales
- Si necesitas otra terminal, usa una nueva sin iniciar el servidor

### 3. Configurar Nodemon

Edita `nodemon.json` (o créalo):

```json
{
  "watch": ["src", "server.js"],
  "ext": "js,json",
  "ignore": ["node_modules", "public"],
  "delay": "1000",
  "execMap": {
    "js": "node"
  }
}
```

### 4. Agregar Script de Limpieza

Edita `package.json`:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "kill": "taskkill /F /IM node.exe",
    "clean": "npm run kill && npm run dev"
  }
}
```

Ahora puedes usar:
```bash
npm run clean
```

---

## 🔍 Diagnóstico Avanzado

### Ver todos los puertos en uso

```bash
netstat -ano | findstr LISTENING
```

### Ver solo procesos Node.js

```bash
tasklist | findstr node.exe
```

### Matar proceso específico de forma segura

```bash
# Primero intenta sin forzar
taskkill /PID 10996

# Si no funciona, fuerza
taskkill /F /PID 10996
```

---

## 📝 Checklist de Solución

Cuando tengas el error, sigue estos pasos:

- [ ] 1. Ejecuta `.\kill-port-3000.bat`
- [ ] 2. Espera 2-3 segundos
- [ ] 3. Verifica con `netstat -ano | findstr :3000`
- [ ] 4. Si está libre, ejecuta `npm run dev`
- [ ] 5. Si sigue ocupado, reinicia la computadora (último recurso)

---

## 🆘 Si Nada Funciona

### Opción 1: Reiniciar Servicios

```bash
# Detener todos los servicios Node
net stop "Node.js"

# Reiniciar
net start "Node.js"
```

### Opción 2: Reiniciar la Computadora

A veces, un reinicio simple resuelve el problema.

### Opción 3: Usar otro Puerto

Cambia permanentemente a otro puerto:

```javascript
// server.js
const PORT = 3001; // o 8000, 8080, 5000, etc.
```

---

## 💡 Tips Útiles

### 1. Alias de PowerShell

Agrega a tu perfil de PowerShell:

```powershell
# Abrir perfil
notepad $PROFILE

# Agregar función
function Kill-Port-3000 {
    $process = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
    if ($process) {
        Stop-Process -Id $process.OwningProcess -Force
        Write-Host "Puerto 3000 liberado!" -ForegroundColor Green
    } else {
        Write-Host "Puerto 3000 ya está libre" -ForegroundColor Yellow
    }
}

# Guardar y recargar
. $PROFILE
```

Ahora puedes usar:
```powershell
Kill-Port-3000
```

### 2. Script NPM Personalizado

```json
{
  "scripts": {
    "predev": "taskkill /F /IM node.exe /FI \"MEMUSAGE gt 2\" 2>nul || exit 0",
    "dev": "nodemon server.js"
  }
}
```

Esto mata procesos Node.js antes de iniciar.

---

## 🎯 Resumen Rápido

```bash
# 1. Encontrar proceso
netstat -ano | findstr :3000

# 2. Matar proceso (reemplaza 10996 con tu PID)
taskkill /F /PID 10996

# 3. Verificar
netstat -ano | findstr :3000

# 4. Iniciar servidor
npm run dev
```

---

## ✅ Solución Aplicada

Ya maté el proceso **PID 10996** que estaba usando el puerto 3000.

**Ahora puedes iniciar el servidor:**

```bash
npm run dev
```

O si prefieres usar el script de inicio normal:

```bash
npm start
```

---

**Fecha:** Octubre 15, 2025  
**Estado:** ✅ Resuelto  
**Puerto liberado:** 3000
