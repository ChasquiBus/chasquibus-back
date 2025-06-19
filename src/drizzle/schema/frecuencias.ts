import { pgTable, serial, integer, varchar, timestamp, time, boolean } from 'drizzle-orm/pg-core';
import { rutas } from './rutas';

export const frecuencias = pgTable('frecuencias', {
  id: serial('id').primaryKey(),
  rutaId: integer('ruta_id').notNull().references(() => rutas.id),
  horaSalidaProg: time('hora_salida_prog').notNull(),
  horaLlegadaProg: time('hora_llegada_prog').notNull(),
  estado: varchar('estado', { length: 50 }).notNull(),
  enUso: boolean('en_uso').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at')
});
