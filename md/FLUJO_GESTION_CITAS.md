# 📅 Flujo de Gestión de Citas - SkinCodeIA

## 🎯 Resumen del Sistema

El sistema de citas funciona con **dos actores principales**:
1. **Cliente** (usuario registrado)
2. **Tatuador** (usuario con perfil de tatuador completado)

---

## 👥 Requisitos Previos

### Para que funcione el sistema de citas:

✅ **Mínimo 1 Cliente registrado**
- Usuario con rol "cliente"
- Perfil de cliente completado (opcional pero recomendado)

✅ **Mínimo 1 Tatuador registrado**
- Usuario con rol "tatuador"
- **Perfil de tatuador COMPLETADO** (obligatorio)
  - Nombre artístico
  - Especialidad
  - Teléfono
  - Portafolio

✅ **Servicios disponibles** (opcional)
- Permite categorizar las citas
- Ejemplo: "Tatuaje pequeño", "Tatuaje grande", "Retoque"

---

## 🔄 Flujo Completo de una Cita

```
┌─────────────────────────────────────────────────────────────┐
│                    FLUJO DE CITAS                           │
└─────────────────────────────────────────────────────────────┘

1. SOLICITUD          2. PROGRAMACIÓN       3. CONFIRMACIÓN
   (Cliente)             (Tatuador/Admin)      (Cliente)
      │                       │                     │
      ▼                       ▼                     ▼
┌──────────┐          ┌──────────┐          ┌──────────┐
│ Cliente  │          │ Tatuador │          │ Cliente  │
│ solicita │──────────│ asigna   │──────────│ confirma │
│   cita   │          │ fecha/   │          │   cita   │
│          │          │ tatuador │          │          │
└──────────┘          └──────────┘          └──────────┘
      │                       │                     │
      ▼                       ▼                     ▼
  SOLICITUD             PROGRAMADA             CONFIRMADA
      │                       │                     │
      │                       │                     ▼
      │                       │              4. REALIZACIÓN
      │                       │                 (Tatuador)
      │                       │                     │
      │                       │                     ▼
      │                       │              ┌──────────┐
      │                       │              │ Tatuador │
      │                       │              │ marca    │
      │                       │              │ realizada│
      │                       │              └──────────┘
      │                       │                     │
      │                       │                     ▼
      │                       │                REALIZADA
      │                       │
      └───────────────────────┴─────────────────────┘
                              │
                              ▼
                         CANCELADA
                    (Cualquier momento)
```

---

## 📋 Estados de una Cita

| Estado | Descripción | Quién lo activa |
|--------|-------------|-----------------|
| **solicitud** | Cliente solicita una cita | Cliente |
| **programada** | Tatuador asigna fecha/hora y tatuador | Tatuador/Admin |
| **confirmada** | Cliente confirma la cita programada | Cliente |
| **realizada** | Cita completada y pagada | Tatuador/Admin |
| **cancelada** | Cita cancelada | Cliente/Tatuador/Admin |

---

## 🎬 Paso 1: Solicitud de Cita (Cliente)

### ¿Quién puede crear solicitudes?
✅ **Solo CLIENTES** (usuarios con rol "cliente")

### ¿Qué información proporciona el cliente?

```javascript
{
  id_servicio: 1,                    // Opcional: Tipo de servicio
  notas_cliente: "Quiero un león",   // Descripción del tatuaje
  url_referencia: "https://...",     // Link a imagen de referencia
  notas_internas: null               // Notas privadas (admin)
}
```

### Proceso:

1. **Cliente inicia sesión**
2. **Navega a "Solicitar Cita"**
3. **Llena formulario**:
   - Servicio (opcional)
   - Descripción del tatuaje deseado
   - URL de referencia (imagen)
   - Notas adicionales
4. **Envía solicitud**
5. **Sistema crea cita con estado "solicitud"**
6. **Se notifica a los administradores/tatuadores**

### Endpoint:
```
POST /api/citas/solicitud
Authorization: Bearer {token}

Body:
{
  "id_servicio": 1,
  "notas_cliente": "Quiero un tatuaje de león en el brazo",
  "url_referencia": "https://example.com/leon.jpg"
}

Response:
{
  "id_cita": 15,
  "message": "Solicitud registrada."
}
```

### Resultado en BD:
```sql
INSERT INTO citas (
  id_usuario_cliente,    -- ID del cliente
  id_usuario_tatuador,   -- NULL (aún no asignado)
  id_servicio,           -- Opcional
  estado,                -- 'solicitud'
  notas_cliente,
  url_referencia
) VALUES (5, NULL, 1, 'solicitud', 'Quiero un león...', 'https://...');
```

---

## 🎬 Paso 2: Programación de Cita (Tatuador/Admin)

### ¿Quién puede programar citas?
✅ **TATUADORES** (pueden programarse a sí mismos)
✅ **ADMINISTRADORES** (pueden asignar cualquier tatuador)

### ¿Qué información se asigna?

```javascript
{
  id_usuario_tatuador: 3,           // ID del tatuador asignado
  fecha_hora_inicio: "2025-10-20 14:00:00",
  fecha_hora_fin: "2025-10-20 16:00:00",
  precio: 150000.00,                // Precio estimado
  notas_internas: "Cliente regular" // Notas privadas
}
```

### Proceso:

1. **Tatuador/Admin ve solicitudes pendientes**
2. **Selecciona una solicitud**
3. **Asigna**:
   - Tatuador responsable
   - Fecha y hora de inicio
   - Fecha y hora de fin
   - Precio estimado
   - Notas internas (opcional)
4. **Sistema valida**:
   - ✅ Tatuador existe
   - ✅ Fechas son válidas
   - ✅ No hay solapamiento de horarios
5. **Cambia estado a "programada"**
6. **Notifica al cliente**

### Endpoint:
```
POST /api/citas/:id/programar
Authorization: Bearer {token}

Body:
{
  "id_usuario_tatuador": 3,
  "fecha_hora_inicio": "2025-10-20 14:00:00",
  "fecha_hora_fin": "2025-10-20 16:00:00",
  "precio": 150000.00,
  "notas_internas": "Cliente regular"
}

Response:
{
  "message": "Cita programada"
}
```

### Validaciones:

#### ✅ No solapamiento de horarios
```sql
-- El sistema verifica que el tatuador NO tenga otra cita en ese horario
SELECT 1 FROM citas
WHERE id_usuario_tatuador = 3
  AND estado IN ('programada', 'confirmada')
  AND fecha_hora_inicio < '2025-10-20 16:00:00'
  AND fecha_hora_fin > '2025-10-20 14:00:00';

-- Si encuentra resultados → ERROR: "Horario no disponible"
```

### Resultado en BD:
```sql
UPDATE citas SET
  id_usuario_tatuador = 3,
  fecha_hora_inicio = '2025-10-20 14:00:00',
  fecha_hora_fin = '2025-10-20 16:00:00',
  precio = 150000.00,
  notas_internas = 'Cliente regular',
  estado = 'programada'
WHERE id_cita = 15;
```

---

## 🎬 Paso 3: Confirmación de Cita (Cliente)

### ¿Quién puede confirmar citas?
✅ **CLIENTE** (dueño de la cita)
✅ **ADMINISTRADORES**

### Proceso:

1. **Cliente recibe notificación** de cita programada
2. **Revisa detalles**:
   - Tatuador asignado
   - Fecha y hora
   - Precio
3. **Confirma asistencia**
4. **Estado cambia a "confirmada"**
5. **Se notifica al tatuador**

### Endpoint:
```
POST /api/citas/:id/confirmar
Authorization: Bearer {token}

Response:
{
  "message": "Cita confirmada"
}
```

### Resultado en BD:
```sql
UPDATE citas SET
  estado = 'confirmada'
WHERE id_cita = 15;
```

---

## 🎬 Paso 4: Realización de Cita (Tatuador)

### ¿Quién puede marcar como realizada?
✅ **TATUADOR** (asignado a la cita)
✅ **ADMINISTRADORES**

### ¿Qué información se registra?

```javascript
{
  pago_monto: 150000.00,      // Monto pagado
  pago_estado: "pagado",      // Estado del pago
  pago_fecha: "2025-10-20"    // Fecha del pago
}
```

### Proceso:

1. **Tatuador completa el trabajo**
2. **Marca la cita como realizada**
3. **Registra información de pago**:
   - Monto pagado
   - Estado del pago
   - Fecha del pago
4. **Estado cambia a "realizada"**
5. **Se notifica al cliente**

### Endpoint:
```
POST /api/citas/:id/realizar
Authorization: Bearer {token}

Body:
{
  "pago_monto": 150000.00,
  "pago_estado": "pagado",
  "pago_fecha": "2025-10-20 16:30:00"
}

Response:
{
  "message": "Cita marcada como realizada"
}
```

### Resultado en BD:
```sql
UPDATE citas SET
  estado = 'realizada',
  pago_monto = 150000.00,
  pago_estado = 'pagado',
  pago_fecha = '2025-10-20 16:30:00'
WHERE id_cita = 15;
```

---

## 🚫 Cancelación de Cita

### ¿Quién puede cancelar?
✅ **CLIENTE** (dueño de la cita)
✅ **TATUADOR** (asignado a la cita)
✅ **ADMINISTRADORES**

### ¿Cuándo se puede cancelar?
✅ En cualquier estado excepto "realizada"

### Proceso:

1. **Usuario decide cancelar**
2. **Proporciona motivo** (opcional)
3. **Estado cambia a "cancelada"**
4. **Se notifica a las partes involucradas**

### Endpoint:
```
POST /api/citas/:id/cancelar
Authorization: Bearer {token}

Body:
{
  "notas_internas": "Cliente canceló por motivos personales"
}

Response:
{
  "message": "Cita cancelada"
}
```

---

## 🔐 Permisos por Rol

### 👤 Cliente

| Acción | Permiso |
|--------|---------|
| Crear solicitud | ✅ Sí |
| Ver sus propias citas | ✅ Sí |
| Confirmar sus citas | ✅ Sí |
| Cancelar sus citas | ✅ Sí |
| Programar citas | ❌ No |
| Ver citas de otros | ❌ No |
| Marcar como realizada | ❌ No |

### 🎨 Tatuador

| Acción | Permiso |
|--------|---------|
| Crear solicitud | ❌ No (es para clientes) |
| Ver citas asignadas a él | ✅ Sí |
| Programar citas | ✅ Sí (asignándose a sí mismo) |
| Confirmar citas | ❌ No (solo el cliente) |
| Cancelar citas asignadas | ✅ Sí |
| Marcar como realizada | ✅ Sí (sus citas) |
| Ver citas de otros tatuadores | ❌ No |

### 👨‍💼 Administrador

| Acción | Permiso |
|--------|---------|
| Ver todas las citas | ✅ Sí |
| Crear solicitudes | ✅ Sí |
| Programar cualquier cita | ✅ Sí |
| Asignar cualquier tatuador | ✅ Sí |
| Confirmar cualquier cita | ✅ Sí |
| Cancelar cualquier cita | ✅ Sí |
| Marcar como realizada | ✅ Sí |
| Editar cualquier campo | ✅ Sí |

---

## 📊 Diagrama de Estados

```
                    ┌─────────────┐
                    │  SOLICITUD  │ ← Cliente crea solicitud
                    └──────┬──────┘
                           │
                           │ Tatuador/Admin programa
                           ▼
                    ┌─────────────┐
                    │ PROGRAMADA  │
                    └──────┬──────┘
                           │
                           │ Cliente confirma
                           ▼
                    ┌─────────────┐
                    │ CONFIRMADA  │
                    └──────┬──────┘
                           │
                           │ Tatuador completa
                           ▼
                    ┌─────────────┐
                    │  REALIZADA  │ ← Estado final
                    └─────────────┘

                    ┌─────────────┐
                    │  CANCELADA  │ ← Desde cualquier estado
                    └─────────────┘
```

---

## 🎯 Ejemplo Completo

### Escenario: Juan quiere un tatuaje

#### 1. Juan (Cliente) solicita cita
```
POST /api/citas/solicitud
{
  "id_servicio": 1,
  "notas_cliente": "Quiero un león realista en el brazo derecho",
  "url_referencia": "https://pinterest.com/leon-realista.jpg"
}

✅ Cita #15 creada con estado "solicitud"
```

#### 2. María (Tatuadora) programa la cita
```
POST /api/citas/15/programar
{
  "id_usuario_tatuador": 3,  // María
  "fecha_hora_inicio": "2025-10-25 14:00:00",
  "fecha_hora_fin": "2025-10-25 17:00:00",
  "precio": 200000.00
}

✅ Cita #15 ahora está "programada"
📧 Juan recibe notificación
```

#### 3. Juan confirma la cita
```
POST /api/citas/15/confirmar

✅ Cita #15 ahora está "confirmada"
📧 María recibe notificación
```

#### 4. María completa el tatuaje
```
POST /api/citas/15/realizar
{
  "pago_monto": 200000.00,
  "pago_estado": "pagado",
  "pago_fecha": "2025-10-25 17:00:00"
}

✅ Cita #15 ahora está "realizada"
📧 Juan recibe notificación de agradecimiento
```

---

## 📱 Interfaces Necesarias

### Para Clientes

1. **Solicitar Cita**
   - Formulario con servicio, descripción, referencia
   - Botón "Enviar Solicitud"

2. **Mis Citas**
   - Lista de citas (todas los estados)
   - Filtros: Pendientes, Confirmadas, Historial
   - Acciones: Ver detalle, Confirmar, Cancelar

3. **Detalle de Cita**
   - Información completa
   - Tatuador asignado
   - Fecha/hora
   - Precio
   - Botones: Confirmar, Cancelar

### Para Tatuadores

1. **Solicitudes Pendientes**
   - Lista de solicitudes sin asignar
   - Botón "Programar" en cada una

2. **Mis Citas**
   - Lista de citas asignadas a él
   - Filtros: Programadas, Confirmadas, Hoy
   - Acciones: Ver, Cancelar, Marcar realizada

3. **Calendario**
   - Vista de calendario con citas
   - Horarios ocupados/disponibles
   - Drag & drop para reprogramar

4. **Programar Cita**
   - Formulario con:
     - Selector de fecha/hora
     - Duración
     - Precio
     - Notas internas

### Para Administradores

1. **Panel de Citas**
   - Todas las citas del sistema
   - Filtros avanzados
   - Exportar a CSV/Excel

2. **Gestión Completa**
   - Crear, editar, eliminar citas
   - Asignar/reasignar tatuadores
   - Ver estadísticas

---

## 🔔 Sistema de Notificaciones

### Eventos que generan notificaciones:

| Evento | Destinatario | Mensaje |
|--------|--------------|---------|
| Nueva solicitud | Tatuadores/Admins | "Nueva solicitud de cita de [Cliente]" |
| Cita programada | Cliente | "Tu cita ha sido programada para [Fecha]" |
| Cita confirmada | Tatuador | "[Cliente] confirmó la cita del [Fecha]" |
| Cita cancelada | Cliente/Tatuador | "La cita del [Fecha] ha sido cancelada" |
| Cita realizada | Cliente | "¡Gracias por tu visita! Esperamos verte pronto" |
| Recordatorio | Cliente/Tatuador | "Recordatorio: Cita mañana a las [Hora]" |

---

## ✅ Validaciones del Sistema

### Al programar cita:

1. ✅ **Tatuador existe** y tiene perfil completo
2. ✅ **Fecha de inicio** es posterior a ahora
3. ✅ **Fecha de fin** es posterior a fecha de inicio
4. ✅ **No hay solapamiento** de horarios para el tatuador
5. ✅ **Duración mínima**: 30 minutos
6. ✅ **Duración máxima**: 8 horas

### Al confirmar cita:

1. ✅ **Cita está en estado "programada"**
2. ✅ **Usuario es el cliente** de la cita
3. ✅ **Fecha no ha pasado**

### Al cancelar cita:

1. ✅ **Cita no está "realizada"**
2. ✅ **Usuario es cliente, tatuador o admin**

### Al marcar como realizada:

1. ✅ **Cita está "confirmada"**
2. ✅ **Usuario es el tatuador** asignado o admin
3. ✅ **Fecha de la cita ya pasó**

---

## 📈 Métricas y Reportes

### Métricas útiles:

- Total de citas por estado
- Tasa de confirmación (confirmadas / programadas)
- Tasa de cancelación
- Ingresos por período
- Citas por tatuador
- Tiempo promedio por cita
- Servicios más solicitados

---

## 🚀 Resumen del Flujo

### ✅ Proceso Ideal

1. **Cliente** solicita cita → Estado: `solicitud`
2. **Tatuador/Admin** programa cita → Estado: `programada`
3. **Cliente** confirma cita → Estado: `confirmada`
4. **Tatuador** realiza trabajo → Estado: `realizada`

### ⚠️ Proceso con Cancelación

1. **Cliente** solicita cita → Estado: `solicitud`
2. **Cliente** cancela → Estado: `cancelada`

O en cualquier punto:
- Alguien cancela → Estado: `cancelada`

---

## 🎯 Recomendaciones

### Para mejorar el flujo:

1. **Agregar recordatorios automáticos**
   - 24 horas antes de la cita
   - 2 horas antes de la cita

2. **Sistema de disponibilidad**
   - Tatuadores marcan horarios disponibles
   - Clientes solo ven horarios libres

3. **Pagos anticipados**
   - Opción de pagar al confirmar
   - Reducir no-shows

4. **Valoraciones**
   - Cliente valora al tatuador después
   - Tatuador valora al cliente

5. **Historial**
   - Ver citas anteriores
   - Repetir cita con mismo tatuador

---

**¿Quieres que implemente alguna de estas interfaces o funcionalidades?** 🎨✨
