// ventas.ts
import { pgTable, serial, integer, varchar, timestamp, decimal } from 'drizzle-orm/pg-core';
import { cooperativaTransporte } from './cooperativa-transporte';
import { clientes } from './clientes';
import { usuarioCooperativa } from './usuario-cooperativa';
import { precios } from './precios';
import { metodosPago } from './metodos-pago';
import { horarios } from './horarios';
import { configuracionAsientos } from './configuracion-asientos';

export const ventas = pgTable('ventas', {
  id: serial('id').primaryKey(),
  cooperativaId: integer('cooperativa_id').references(() => cooperativaTransporte.id),
  clienteId: integer('cliente_id').references(() => clientes.id),
  oficinistaId: integer('oficinista_id').references(() => usuarioCooperativa.id),
  precioId: integer('precio_id').references(() => precios.id),
  metodoPagoId: integer('metodo_pago_id').references(() => metodosPago.id),
  horarioId: integer('horario_id').references(() => horarios.id),
  asientoId: integer('asiento_id').references(() => configuracionAsientos.id),
  estadoPago: varchar('estado_pago', { length: 50 }),//pagado, pendiente, anulado
  codigoQR: varchar('codigoQR', { length: 255 }),
  comprobanteUrl: varchar('comprobanteUrl', { length: 255 }),
  fechaVenta: timestamp('fechaVenta', { precision: 3 }),
  totalSinDescuento: decimal('totalSinDescuento', { precision: 10, scale: 2 }),
  totalDescuentos: decimal('totalDescuentos', { precision: 10, scale: 2 }),
  totalFinal: decimal('totalFinal', { precision: 10, scale: 2 }),
});
