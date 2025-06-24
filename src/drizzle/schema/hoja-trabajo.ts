import { pgTable, serial, integer, varchar, date, timestamp } from 'drizzle-orm/pg-core';
import { buses } from './bus';
import { choferes } from './choferes';
import { frecuencias } from './frecuencias';

export const hojaTrabajo = pgTable('hoja_trabajo', {
  id: serial('id').primaryKey(),
  busId: integer('bus_id').notNull().references(() => buses.id),
  choferId: integer('chofer_id').notNull().references(() => choferes.id),
  frecDiaId: integer('frec_dia_id').notNull().references(() => frecuencias.id),
  observaciones: varchar('observaciones', { length: 255 }),
  estado: varchar('estado', { length: 20 }).notNull(), // Ej: Programado, Suspendido, etc.
  horaSalidaReal: timestamp('hora_salida_real'),
  horaLlegadaReal: timestamp('hora_llegada_real'),
  fechaSalida: date('fecha_salida')
});
