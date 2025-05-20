import { pgTable, serial, varchar, boolean, timestamp, uniqueIndex, integer } from "drizzle-orm/pg-core";

export const usuarios = pgTable(
  "usuarios",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 100 }).notNull(),
    passwordHash: varchar("password_hash", { length: 100 }).notNull(),
    nombre: varchar("nombre", { length: 50 }).notNull(),
    apellido: varchar("apellido", { length: 50 }).notNull(),
    cedula: varchar("cedula", { length: 20 }).notNull(),
    telefono: varchar("telefono", { length: 20 }),
    activo: boolean("activo").default(true),
    rol: integer("rol").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    deletedAt: timestamp("deleted_at"),
  },
  (usuarios) => ({
    emailUnique: uniqueIndex("usuarios_email_unique").on(usuarios.email),
    cedulaUnique: uniqueIndex("usuarios_cedula_unique").on(usuarios.cedula),
  })
);