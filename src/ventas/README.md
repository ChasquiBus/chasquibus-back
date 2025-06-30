# Módulo de Ventas

Este módulo maneja todas las operaciones relacionadas con las ventas del sistema de transporte.

## Endpoints Disponibles

### Para Administradores

#### GET `/ventas/oficinista/:oficinistaId`
- **Descripción**: Obtiene todas las ventas de un oficinista específico
- **Autenticación**: Requerida (JWT)
- **Autorización**: Solo ADMIN (1) y SUPERADMIN (5)
- **Parámetros**: `oficinistaId` - ID del oficinista
- **Respuesta**: Lista de ventas del oficinista

### Para Administradores y Oficinistas

#### GET `/ventas/cooperativa`
- **Descripción**: Obtiene todas las ventas de la cooperativa del usuario autenticado
- **Autenticación**: Requerida (JWT)
- **Autorización**: Solo ADMIN (1) y OFICINISTA (2)
- **Parámetros**: Ninguno
- **Respuesta**: Lista de ventas de la cooperativa

#### GET `/ventas/cooperativa/estado/:estadoPago`
- **Descripción**: Obtiene ventas por estado de pago de la cooperativa
- **Autenticación**: Requerida (JWT)
- **Autorización**: Solo ADMIN (1) y OFICINISTA (2)
- **Parámetros**: `estadoPago` - Estado de pago (pendiente, pagado, procesando, rechazado, cancelado)
- **Respuesta**: Lista de ventas con el estado especificado

#### GET `/ventas/cooperativa/tipo/:tipoVenta`
- **Descripción**: Obtiene ventas por tipo de venta de la cooperativa
- **Autenticación**: Requerida (JWT)
- **Autorización**: Solo ADMIN (1) y OFICINISTA (2)
- **Parámetros**: `tipoVenta` - Tipo de venta (presencial, online)
- **Respuesta**: Lista de ventas con el tipo especificado

#### POST `/ventas/presencial`
- **Descripción**: Crear una nueva venta presencial (efectivo)
- **Autenticación**: Requerida (JWT)
- **Autorización**: Solo ADMIN (1) y OFICINISTA (2)
- **Body**: `CreateVentaPresencialDto`
- **Respuesta**: Venta creada con boletos

#### GET `/ventas/cliente/:clienteId`
- **Descripción**: Obtener ventas por cliente
- **Autenticación**: Requerida (JWT)
- **Autorización**: Solo ADMIN (1), OFICINISTA (2) y SUPERADMIN (5)
- **Parámetros**: `clienteId` - ID del cliente
- **Respuesta**: Lista de ventas del cliente

#### GET `/ventas/estado/:estadoPago`
- **Descripción**: Obtener ventas por estado de pago
- **Autenticación**: Requerida (JWT)
- **Autorización**: Solo ADMIN (1), OFICINISTA (2) y SUPERADMIN (5)
- **Parámetros**: `estadoPago` - Estado de pago
- **Respuesta**: Lista de ventas con el estado especificado

#### GET `/ventas/:id`
- **Descripción**: Obtener una venta por ID
- **Autenticación**: Requerida (JWT)
- **Autorización**: Solo ADMIN (1), OFICINISTA (2) y SUPERADMIN (5)
- **Parámetros**: `id` - ID de la venta
- **Respuesta**: Venta encontrada

### Solo para Oficinistas

#### PATCH `/ventas/:id/estado-pago`
- **Descripción**: Modificar el estado de pago de una venta
- **Autenticación**: Requerida (JWT)
- **Autorización**: Solo OFICINISTA (2)
- **Parámetros**: `id` - ID de la venta
- **Body**: `UpdateEstadoPagoDto`
- **Respuesta**: Venta con estado actualizado

### Para Clientes

#### GET `/ventas/mis-ventas`
- **Descripción**: Obtiene todas las ventas del cliente autenticado (solo pagadas)
- **Autenticación**: Requerida (JWT)
- **Autorización**: Solo CLIENTE (4)
- **Parámetros**: Ninguno
- **Respuesta**: Lista de ventas del cliente con estado pagado

#### POST `/ventas/app-cliente`
- **Descripción**: Crear una nueva venta con información completa de pago
- **Autenticación**: Requerida (JWT)
- **Autorización**: Solo CLIENTE (4)
- **Body**: `CreateVentaDto`
- **Respuesta**: Venta creada con boletos y datos de pago

## Estados de Pago Disponibles

```typescript
enum EstadoPago {
  PENDIENTE = 'pendiente',
  APROBADO = 'pagado',
  PROCESANDO = 'procesando',
  RECHAZADO = 'rechazado',
  CANCELADO = 'cancelado'
}
```

## Tipos de Venta Disponibles

```typescript
enum TipoVenta {
  PRESENCIAL = 'presencial',
  ONLINE = 'online'
}
```

## Información del Token JWT

El token JWT debe contener la siguiente información:
- `sub`: ID del usuario
- `email`: Email del usuario
- `rol`: Rol del usuario (1=Admin, 2=Oficinista, 3=Chofer, 4=Cliente, 5=Superadmin)
- `cooperativaId`: ID de la cooperativa (para admins y oficinistas)

## Filtros Aplicados

### Para Clientes
- Solo se muestran ventas con `estado_pago = 'pagado'`
- Se filtra por el `usuarioId` del token a través de la tabla `clientes`

### Para Administradores y Oficinistas
- Se muestran todas las ventas de la cooperativa especificada en el token
- Se filtra por `cooperativaId` del token a través de la tabla `ventas`

### Para Administradores
- Pueden ver ventas de cualquier oficinista específico
- Acceso completo a todas las ventas del sistema

## Estructura de Datos

Las ventas incluyen la siguiente información:
- ID de la venta
- ID de la cooperativa
- ID del cliente (opcional para ventas presenciales)
- ID del oficinista (opcional para ventas online)
- ID del método de pago
- ID de la hoja de trabajo
- Estado de pago
- URL del comprobante
- Fecha de venta
- Tipo de venta
- Totales (sin descuento, descuentos, total final)
- Fechas de creación y actualización 