import { pgTable, serial, integer, varchar, decimal, text ,boolean} from 'drizzle-orm/pg-core';

import { ventas } from './ventas';
import { tarifas } from './tarifas';
import { descuentos } from './descuentos';

export const boletos = pgTable('boletos', {
  id: serial('id').primaryKey(),

  ventaId: integer('venta_id').references(() => ventas.id),
  tarifaId: integer('tarifa_id').references(() => tarifas.id),
  descuentoId: integer('descuento_id').references(() => descuentos.id),
  asientoNumero: integer('numero_asiento').notNull(),
  codigoQr: text('codigo_qr'),
  usado: boolean('usado').notNull().default(false),
  cedula: varchar('cedula', { length: 20 }),
  nombre: varchar('nombre', { length: 255 }),
  apellido: varchar('apellido', { length: 255 }),
  totalSinDescPorPers: decimal('total_sin_desc_por_pers', { precision: 10, scale: 2 }),
  totalDescPorPers: decimal('total_desc_por_pers', { precision: 10, scale: 2 }),
  totalPorPer: decimal('total_por_per', { precision: 10, scale: 2 }),
});
