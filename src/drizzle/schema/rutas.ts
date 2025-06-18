//rutas.ts
import { pgTable, serial, integer, varchar, date, timestamp, boolean } from 'drizzle-orm/pg-core';
import { paradas } from './paradas';
import { cooperativaTransporte } from './cooperativa-transporte';

export const rutas = pgTable('rutas', {
  id: serial('id').primaryKey(),
  paradaOrigenId: integer('parada_origen_id').notNull().references(() => paradas.id),
  paradaDestinoId: integer('parada_destino_id').notNull().references(() => paradas.id),
  cooperativaId: integer('cooperativa_id').notNull().references(() => cooperativaTransporte.id),
  codigo: varchar('codigo', { length: 50 }).notNull(), //Ejemplo: [AMB-QUI]
  prioridad: integer('prioridad'), //Del 1 al 3 siendo 1 la más alta
  resolucionUrl: varchar('resolucion_url', { length: 255 }).notNull().default(''),
  fechaIniVigencia: date('fecha_ini_vigencia'),
  fechaFinVigencia: date('fecha_fin_vigencia'),
  estado: boolean('estado').notNull().default(true),
  enUso: boolean('en_uso').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});
