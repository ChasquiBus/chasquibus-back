import { boolean, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";


export const cooperativaTransporte = pgTable('cooperativa_transporte', {
  id: serial("id").primaryKey(),
  nombre: varchar("nombre", { length: 100 }).notNull(),
  ruc: varchar("ruc", { length: 20 }),
  logo: varchar("logo", { length: 255 }),
  colorPrimario: varchar("color_primario", { length: 20 }),
  colorSecundario: varchar("color_secundario", { length: 20 }),
  sitioWeb: varchar("sitio_web", { length: 255 }),
  email: varchar("email", { length: 100 }),
  telefono: varchar("telefono", { length: 20 }),
  direccion: varchar("direccion", { length: 255 }),
  facebook: varchar("facebook", { length: 255 }),
  instagram: varchar("instagram", { length: 255 }),
  twitter: varchar("twitter", { length: 255 }),
  tiktok: varchar("tiktok", { length: 255 }),
  activo: boolean("activo").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});