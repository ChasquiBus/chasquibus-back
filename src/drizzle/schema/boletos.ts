import { pgTable, serial, integer, varchar, decimal } from 'drizzle-orm/pg-core';

import { ventas } from './ventas';
import { configuracionAsientos } from './configuracion-asientos';
import { tarifas } from './tarifas';
import { descuentos } from './descuentos';
import { hojaTrabajo } from './hoja-trabajo';

export const boletos = pgTable('boletos', {
  id: serial('id').primaryKey(),

  ventaId: integer('venta_id').references(() => ventas.id),
  hojaTrabajoId: integer('hoja_trabajo').references(() => hojaTrabajo.id),
  asientoId: integer('asiento_id').references(() => configuracionAsientos.id),
  tarifaId: integer('tarifa_id').references(() => tarifas.id),
  descuentoId: integer('descuento_id').references(() => descuentos.id),
  codigoQr: varchar('codigo_qr', { length: 255 }),
  cedula: varchar('cedula', { length: 20 }),
  nombre: varchar('nombre', { length: 255 }),
  totalSinDescPorPers: decimal('total_sin_desc_por_pers', { precision: 10, scale: 2 }),
  totalDescPorPers: decimal('total_desc_por_pers', { precision: 10, scale: 2 }),
  totalPorPer: decimal('total_por_per', { precision: 10, scale: 2 }),
});
