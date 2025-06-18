import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const dias = pgTable('dias', {
  id: serial('id').primaryKey(),
  nombre: varchar('nombre', { length: 50 }).notNull(),
  codigo: varchar('codigo', { length: 10 }).notNull()
});
