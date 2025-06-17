import { pgTable, serial, integer, varchar, date, timestamp, decimal } from 'drizzle-orm/pg-core';
import { rutas } from './rutas';
import { paradas } from './paradas';
import { configuracionAsientos } from './configuracion-asientos';

export const tarifas = pgTable('tarifas', {
  id: serial('id').primaryKey(),
  rutaId: integer('ruta_id').notNull().references(() => rutas.id),
  paradaOrigenId: integer('parada_origen_id').notNull().references(() => paradas.id),
  paradaDestinoId: integer('parada_destino_id').notNull().references(() => paradas.id),
  tipoAsientoId: integer('tipo_asiento_id').notNull().references(() => configuracionAsientos.id),
  valor: decimal('valor', { precision: 5, scale: 2 }).notNull(),
  fechaIniVigencia: date('fecha_ini_vigencia'),
  fechaFinVigencia: date('fecha_fin_vigencia'),
  estado: varchar('estado', { length: 50 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
});
