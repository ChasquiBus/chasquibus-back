// ciudades.ts
import { integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const provincias = pgTable('provincias', {
  id: serial('id').primaryKey(),
  nombre: varchar('nombre', { length: 255 }).notNull()
  });

export const ciudades = pgTable('ciudades', {
  id: serial('id').primaryKey(),
  provincia_id: integer('provincia_id').notNull().references(() => provincias.id),
  ciudad: varchar('ciudad', { length: 255 }).notNull(),
  codigoPostal: varchar('codigo', { length: 5 })
  //cooperativaId: integer('cooperativa_id').references(() => cooperativaTransporte.id),
});