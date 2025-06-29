# Módulo de Pagos - Chasquibus Backend

## Descripción General

El módulo de pagos maneja la integración con métodos de pago para el sistema de ventas de boletos de transporte. Actualmente soporta dos métodos de pago:

1. **PayPal** - Integración simulada con sandbox
2. **Depósito Bancario** - Validación manual por oficinistas

## Flujo de Trabajo

### 1. Creación de Venta y Procesamiento de Pago

1. El cliente selecciona boletos y método de pago
2. Se crea la venta con estado `PENDIENTE`
3. Se procesa automáticamente el pago según el método seleccionado
4. Se retorna la información necesaria para completar el pago

### 2. Métodos de Pago

#### PayPal (Simulado)
- **Configuración**: Requiere `clientId`, `clientSecret`, `mode`, `webhookId`
- **Flujo**: 
  - Se genera URL simulada del sandbox
  - Se simula webhook para aprobar/rechazar pagos
  - Estados: `COMPLETED`, `APPROVED`, `DENIED`, `FAILED`

#### Depósito Bancario
- **Configuración**: Requiere información bancaria (banco, cuenta, titular, etc.)
- **Flujo**:
  - Se generan instrucciones de depósito
  - Se proporciona código de referencia único
  - Validación manual por oficinista

## Endpoints Disponibles

### Creación de Ventas

#### `POST /ventas/con-pago` (Nuevo)
Crea una venta y retorna información completa incluyendo boletos y datos de pago.

**Respuesta:**
```json
{
  "venta": {
    "id": 123,
    "cooperativaId": 1,
    "clienteId": 5,
    "estadoPago": "pendiente",
    "totalFinal": "25.50",
    "fechaVenta": "2024-01-15T10:30:00Z"
  },
  "boletos": [
    {
      "id": 1,
      "ventaId": 123,
      "asiento": "A1",
      "totalPorPer": "25.50"
    }
  ],
  "pago": {
    "url": "https://www.sandbox.paypal.com/checkoutnow?token=...",
    "externalReference": "PAYPAL-123-456789",
    "mensaje": "Redirigiendo al sandbox de PayPal"
  }
}
```

### Procesamiento de Pagos

#### `POST /pagos/procesar/:ventaId/:metodoPagoId`
Procesa el pago de una venta según el método seleccionado.

**Respuesta PayPal:**
```json
{
  "url": "https://www.sandbox.paypal.com/checkoutnow?token=...",
  "externalReference": "PAYPAL-123-456789",
  "mensaje": "Redirigiendo al sandbox de PayPal",
  "configuracion": {
    "clientId": "AYsWLXgH...",
    "mode": "sandbox",
    "webhookId": "string"
  },
  "venta": {
    "id": 123,
    "totalFinal": "25.50",
    "fechaVenta": "2024-01-15T10:30:00Z"
  }
}
```

**Respuesta Depósito:**
```json
{
  "codigoDeposito": "DEP-123-456789",
  "mensaje": "Instrucciones para realizar el depósito",
  "instrucciones": {
    "banco": "Banco Pichincha",
    "numeroCuenta": "1234567890",
    "tipoCuenta": "ahorros",
    "titular": "Cooperativa de Transporte El Dorado",
    "identificacion": "1234567890001",
    "instrucciones": "Realice el depósito y cargue el comprobante",
    "monto": "25.50",
    "codigoReferencia": "DEP-123-456789"
  },
  "pasos": [
    "1. Diríjase a cualquier agencia del banco o use banca en línea",
    "2. Realice el depósito a la cuenta especificada",
    "3. Use el código de referencia proporcionado",
    "4. Guarde el comprobante de depósito",
    "5. Cargue el comprobante en el sistema para validación"
  ]
}
```

### Webhook PayPal (Simulado)

#### `POST /pagos/paypal/webhook-simulado/:ventaId`
Simula la recepción de un webhook de PayPal.

**Body:**
```json
{
  "paymentStatus": "COMPLETED",
  "transactionId": "TXN123456"
}
```

### Validación Manual (Depósitos)

#### `PATCH /pagos/deposito/:ventaId/validar`
Permite al oficinista validar manualmente un depósito.

**Body:**
```json
{
  "comprobanteUrl": "https://ejemplo.com/comprobante.jpg",
  "observaciones": "Depósito validado correctamente"
}
```

#### `PATCH /pagos/deposito/:ventaId/rechazar`
Permite al oficinista rechazar un depósito.

**Body:**
```json
{
  "motivo": "Comprobante no válido"
}
```

### Gestión de Estados

#### `PATCH /pagos/cancelar/:ventaId`
Cancela un pago pendiente.

#### `PATCH /pagos/rechazar/:ventaId`
Rechaza un pago pendiente.

**Body:**
```json
{
  "motivo": "Pago no válido"
}
```

## Estados de Pago

- `PENDIENTE` - Pago creado, esperando procesamiento
- `APROBADO` - Pago confirmado y aprobado
- `PROCESANDO` - Pago en proceso de validación
- `RECHAZADO` - Pago rechazado
- `CANCELADO` - Pago cancelado

## Configuración de Métodos de Pago

### PayPal
```json
{
  "nombre": "Pago vía PayPal",
  "descripcion": "Pago a través de PayPal",
  "procesador": "paypal",
  "configuracionPaypal": {
    "clientId": "AYsWLXgH...",
    "clientSecret": "EHLZn...",
    "mode": "sandbox",
    "webhookId": "string"
  },
  "activo": true
}
```

### Depósito
```json
{
  "nombre": "Pago vía Deposito",
  "descripcion": "Pago Depósito",
  "procesador": "deposito",
  "configuracionDeposito": {
    "banco": "Banco Pichincha",
    "numeroCuenta": "1234567890",
    "tipoCuenta": "ahorros",
    "titular": "Cooperativa de Transporte El Dorado",
    "identificacion": "1234567890001",
    "instrucciones": "instrucciones"
  },
  "activo": true
}
```

## Integración con Ventas

El módulo de pagos se integra automáticamente con el flujo de creación de ventas:

### Opción 1: Venta Simple
```typescript
POST /ventas
// Retorna solo la venta creada
```

### Opción 2: Venta con Información Completa
```typescript
POST /ventas/con-pago
// Retorna venta + boletos + información de pago
```

1. Se crea la venta con estado `PENDIENTE`
2. Se procesa automáticamente el pago
3. Se retorna la información necesaria para completar el pago
4. El cliente puede proceder según las instrucciones recibidas

## Roles y Permisos

- **Cliente**: Puede procesar pagos y cancelar sus propios pagos
- **Oficinista**: Puede validar/rechazar depósitos y gestionar pagos
- **Admin**: Acceso completo a todas las funcionalidades

## Notas de Implementación

- Los pagos de PayPal son simulados usando el sandbox
- Los depósitos requieren validación manual por oficinistas
- Todos los endpoints están protegidos con autenticación JWT
- Se incluye documentación completa con Swagger
- El sistema maneja errores gracefully sin afectar la creación de ventas
- Se mantiene compatibilidad con el endpoint original de ventas
- Nuevo endpoint `/ventas/con-pago` para obtener información completa 