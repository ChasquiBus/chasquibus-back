import { pgTable, serial, varchar, boolean, integer, timestamp } from 'drizzle-orm/pg-core';

export const usuarios = pgTable("usuarios", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 100 }).notNull(),
  passwordHash: varchar("password_hash", { length: 100 }).notNull(),
  nombre: varchar("nombre", { length: 50 }).notNull(),
  apellido: varchar("apellido", { length: 50 }).notNull(),
  cedula: varchar("cedula", { length: 20 }).notNull(),
  telefono: varchar("telefono", { length: 20 }),
  activo: boolean("activo").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

export type Usuario = typeof usuarios.$inferSelect;
export type NewUsuario = typeof usuarios.$inferInsert;