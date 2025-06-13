// ciudades.ts
import { integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { cooperativaTransporte } from './cooperativa-transporte';

export const ciudades = pgTable('ciudades', {
  id: serial('id').primaryKey(),
  provincia: varchar('provincia', { length: 255 }).notNull(),
  ciudad: varchar('ciudad', { length: 255 }).notNull(),
  cooperativaId: integer('cooperativa_id').references(() => cooperativaTransporte.id),

});