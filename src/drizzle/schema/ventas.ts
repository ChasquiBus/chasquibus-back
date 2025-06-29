import { pgTable, serial, integer, varchar, timestamp, decimal } from 'drizzle-orm/pg-core';
import { cooperativaTransporte } from './cooperativa-transporte';
import { clientes } from './clientes';
import { usuarioCooperativa } from './usuario-cooperativa';
import { metodosPago } from './metodos-pago';
import { hojaTrabajo } from './hoja-trabajo';

export const ventas = pgTable('ventas', {
  id: serial('id').primaryKey(),

  cooperativaId: integer('cooperativa_id').references(() => cooperativaTransporte.id),
  clienteId: integer('cliente_id').references(() => clientes.id),
  oficinistaId: integer('oficinista_id').references(() => usuarioCooperativa.id),
  metodoPagoId: integer('metodo_pago_id').references(() => metodosPago.id),
  hojaTrabajoId: integer('hoja_trabajo').references(() => hojaTrabajo.id),

  estadoPago: varchar('estado_pago', { length: 50 }),
  comprobanteUrl: varchar('comprobanteurl', { length: 255 }),
  fechaVenta: timestamp('fecha_venta', { precision: 3 }),
  tipoVenta: varchar('tipo_venta', { length: 20 }),

  totalSinDescuento: decimal('total_sin_desc', { precision: 10, scale: 2 }),
  totalDescuentos: decimal('total_desc', { precision: 10, scale: 2 }),
  totalFinal: decimal('total_final', { precision: 10, scale: 2 }),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
