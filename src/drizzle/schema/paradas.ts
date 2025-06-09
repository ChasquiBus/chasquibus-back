// paradas.ts
import { pgTable, serial, integer, varchar, boolean } from 'drizzle-orm/pg-core';
import { ciudades } from './ciudades';

export const paradas = pgTable('paradas', {
  id: serial('id').primaryKey(),
  ciudadId: integer('ciudad_id').references(() => ciudades.id),
  nombreParada: varchar('nombre_parada', { length: 255 }),
  direccion: varchar('direccion', { length: 255 }),
  estado: varchar('estado', { length: 50 }), // Activa, Inactiva, suspendida
  esTerminal: boolean('es_terminal')
});