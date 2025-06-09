// ciudades.ts
import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const ciudades = pgTable('ciudades', {
  id: serial('id').primaryKey(),
  provincia: varchar('provincia', { length: 255 }),
  ciudad: varchar('ciudad', { length: 255 })
});