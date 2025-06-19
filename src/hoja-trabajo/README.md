# Módulo de Hojas de Trabajo

Este módulo maneja las hojas de trabajo del sistema de transporte, permitiendo asignar buses, choferes y frecuencias para los viajes.

## Entidad

La entidad `hoja_trabajo` contiene los siguientes campos:

- `id`: Identificador único (autoincremental)
- `busId`: ID del bus asignado (referencia a la tabla `buses`)
- `choferId`: ID del chofer asignado (referencia a la tabla `choferes`)
- `frecDiaId`: ID de la frecuencia del día (referencia a la tabla `frecuencia_dias`)
- `observaciones`: Observaciones adicionales (opcional, máximo 255 caracteres)
- `estado`: Estado actual de la hoja de trabajo (Programado, En Curso, Completado, Suspendido, Cancelado)
- `horaSalidaReal`: Hora real de salida del bus (opcional)
- `horaLlegadaReal`: Hora real de llegada del bus (opcional)
- `fechaSalida`: Fecha de salida programada (opcional)

## Endpoints Disponibles

### CRUD Básico

- `POST /hoja-trabajo` - Crear una nueva hoja de trabajo
- `GET /hoja-trabajo` - Obtener todas las hojas de trabajo
- `GET /hoja-trabajo/:id` - Obtener una hoja de trabajo por ID
- `PATCH /hoja-trabajo/:id` - Actualizar una hoja de trabajo
- `DELETE /hoja-trabajo/:id` - Eliminar una hoja de trabajo

### Consultas Específicas

- `GET /hoja-trabajo/bus/:busId` - Obtener hojas de trabajo por bus
- `GET /hoja-trabajo/chofer/:choferId` - Obtener hojas de trabajo por chofer
- `GET /hoja-trabajo/estado/:estado` - Obtener hojas de trabajo por estado

## Estados de Hoja de Trabajo

- `Programado`: La hoja de trabajo está programada pero no ha comenzado
- `En Curso`: El viaje está en progreso
- `Completado`: El viaje ha sido completado exitosamente
- `Suspendido`: El viaje ha sido suspendido temporalmente
- `Cancelado`: El viaje ha sido cancelado

## Validaciones

El sistema valida automáticamente:

1. **Existencia de referencias**: Verifica que el bus, chofer y frecuencia del día existan antes de crear/actualizar
2. **Tipos de datos**: Valida que los campos tengan el tipo correcto
3. **Campos requeridos**: Asegura que los campos obligatorios estén presentes
4. **Enums**: Valida que el estado sea uno de los valores permitidos

## Permisos

- **ADMIN**: Acceso completo a todas las operaciones
- **OFICINISTA**: Acceso completo a todas las operaciones

## Ejemplo de Uso

### Crear una hoja de trabajo

```json
POST /hoja-trabajo
{
  "busId": 1,
  "choferId": 1,
  "frecDiaId": 1,
  "observaciones": "Viaje especial con paradas adicionales",
  "estado": "Programado",
  "fechaSalida": "2024-01-15"
}
```

### Actualizar estado de una hoja de trabajo

```json
PATCH /hoja-trabajo/1
{
  "estado": "En Curso",
  "horaSalidaReal": "2024-01-15T08:00:00Z"
}
```

## Respuestas

Todas las respuestas siguen el formato:

```json
{
  "message": "Mensaje descriptivo",
  "data": {
    // Datos de la hoja de trabajo
  }
}
```

Para listas:

```json
{
  "message": "Mensaje descriptivo",
  "data": [
    // Array de hojas de trabajo
  ],
  "count": 10
}
```

## Manejo de Errores

- `400 Bad Request`: Datos inválidos o referencias inexistentes
- `401 Unauthorized`: Token de autenticación inválido o faltante
- `403 Forbidden`: Sin permisos suficientes
- `404 Not Found`: Hoja de trabajo no encontrada 