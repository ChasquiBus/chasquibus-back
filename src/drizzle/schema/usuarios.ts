import { pgTable, serial, varchar, boolean, integer } from 'drizzle-orm/pg-core';

export const usuarios = pgTable('usuarios', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 100 }).notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  estado: boolean('estado').default(true),
  rol: integer('rol').notNull(), // 1=admin, 2=secretaria, 3=chofer, 4=cliente
});
export type Usuario = typeof usuarios.$inferSelect;
export type NewUsuario = typeof usuarios.$inferInsert;