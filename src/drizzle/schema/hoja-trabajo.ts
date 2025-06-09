// hoja-trabajo.ts
import { pgTable, serial, integer, varchar } from 'drizzle-orm/pg-core';

export const hojaTrabajo = pgTable('hoja_trabajo', {
  id: serial('id').primaryKey(),
  busId: integer('bus_id'),
  choferId: integer('chofer_id'),
  controladorId: integer('controlador_id'),
  observaciones: varchar('observaciones', { length: 255 }),
  estado: varchar('estado', { length: 50 }) // Programado, Suspendido, En Curso, Terminado
});
