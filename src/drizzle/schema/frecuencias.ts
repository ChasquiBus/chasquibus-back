import { pgTable, serial, integer, varchar, timestamp } from 'drizzle-orm/pg-core';
import { rutas } from './rutas';

export const frecuencias = pgTable('frecuencias', {
  id: serial('id').primaryKey(),
  rutaId: integer('ruta_id').notNull().references(() => rutas.id),
  horaSalidaProg: timestamp('hora_salida_prog', { withTimezone: true }).notNull(),
  horaLlegadaProg: timestamp('hora_llegada_prog', { withTimezone: true }).notNull(),
  estado: varchar('estado', { length: 50 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true })
});
