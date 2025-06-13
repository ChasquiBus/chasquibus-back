// paradas.ts
import { pgTable, serial, integer, varchar, boolean } from 'drizzle-orm/pg-core';
import { ciudades } from './ciudades';
import { cooperativaTransporte } from './cooperativa-transporte';

export const paradas = pgTable('paradas', {
  id: serial('id').primaryKey(),
  ciudadId: integer('ciudad_id').references(() => ciudades.id),
  nombreParada: varchar('nombre_parada', { length: 255 }),
  direccion: varchar('direccion', { length: 255 }),
  estado: boolean('estado'), // activa, inactiva
  esTerminal: boolean('es_terminal'),
  cooperativaId: integer('cooperativa_id').references(() => cooperativaTransporte.id),

});