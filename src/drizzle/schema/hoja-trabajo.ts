// hoja-trabajo.ts
import { pgTable, serial, integer, varchar } from 'drizzle-orm/pg-core';
import { buses } from './bus';
import { choferes } from './choferes';
import { usuarios } from './usuarios';

export const hojaTrabajo = pgTable('hoja_trabajo', {
  id: serial('id').primaryKey(),
  busId: integer('bus_id').references(() => buses.id),
  choferId: integer('chofer_id').references(() => choferes.id),
  controladorId: integer('controlador_id').references(() => usuarios.id),
  observaciones: varchar('observaciones', { length: 255 }),
  estado: varchar('estado', { length: 50 })
});
