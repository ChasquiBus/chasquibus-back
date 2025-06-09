// ventas.ts
import { pgTable, serial, integer, varchar, timestamp, decimal } from 'drizzle-orm/pg-core';

export const ventas = pgTable('ventas', {
  id: serial('id').primaryKey(),
  cooperativaId: integer('cooperativa_id'),
  clienteId: integer('cliente_id'),
  oficinistaId: integer('oficinista_id'),
  precioId: integer('precio_id'),
  metodoPagoId: integer('metodo_pago_id'),
  estadoPago: varchar('estado_pago', { length: 50 }),
  comprobanteUrl: varchar('comprobanteUrl', { length: 255 }),
  fechaVenta: timestamp('fechaVenta', { precision: 3 }),
  totalSinDescuento: decimal('totalSinDescuento', { precision: 10, scale: 2 }),
  totalDescuentos: decimal('totalDescuentos', { precision: 10, scale: 2 }),
  totalFinal: decimal('totalFinal', { precision: 10, scale: 2 })
});
