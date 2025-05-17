import { boolean, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";


export const cooperativaTransporte = pgTable('cooperativa_transporte', {
  id: serial("id").primaryKey(),
  nombre: varchar("nombre", { length: 100 }).notNull(),
  logo: varchar("logo", { length: 255 }),
  colorPrimario: varchar("color_primario", { length: 20 }),
  colorSecundario: varchar("color_secundario", { length: 20 }),
  email: varchar("email", { length: 100 }),
  telefono: varchar("telefono", { length: 20 }),
  activo: boolean("activo").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});