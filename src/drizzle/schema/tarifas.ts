import { pgTable, serial, integer, varchar, date, timestamp, decimal, boolean } from 'drizzle-orm/pg-core';
import { rutas } from './rutas';
import { paradas } from './paradas';
import { configuracionAsientos } from './configuracion-asientos';

export const tarifas = pgTable('tarifas', {
  id: serial('id').primaryKey(),
  rutaId: integer('ruta_id').notNull().references(() => rutas.id),
  paradaOrigenId: integer('parada_origen_id').notNull().references(() => paradas.id),
  paradaDestinoId: integer('parada_destino_id').notNull().references(() => paradas.id),
  tipoAsiento: varchar('tipo_asiento', { length: 10 }),
  valor: decimal('valor', { precision: 5, scale: 2 }).notNull(),
  aplicaTarifa: boolean('aplica_tarifa').default(true)
});
