import { pgTable, serial, varchar, boolean, timestamp, integer } from "drizzle-orm/pg-core";

export const usuarios = pgTable("usuarios", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 100 }).notNull(),
  nombre: varchar("nombre", { length: 50 }).notNull(),
  apellido: varchar("apellido", { length: 50 }).notNull(),
  cedula: varchar("cedula", { length: 20 }).notNull().unique(),
  telefono: varchar("telefono", { length: 20 }),
  activo: boolean("activo").notNull().default(true),
  rol: integer("rol").notNull(), //1=Admin, 2=Oficinista, 3=Chofer, 4=Cliente, 5=Superadmin
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});