import { pgTable, serial, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";

export const buses = pgTable("buses", {
  id: serial("id").primaryKey(),
  cooperativa_id: integer("cooperativa_id").notNull(),
  placa: varchar("placa", { length: 10 }).notNull(),
  numero_bus: varchar("numero_bus", { length: 10 }).notNull(),
  marca_chasis: varchar("marca_chasis", { length: 50 }),
  marca_carroceria: varchar("marca_carroceria", { length: 50 }),
  imagen: varchar("imagen", { length: 255 }),
  piso_doble: boolean("piso_doble").default(false),
  total_asientos: integer("total_asientos").notNull(),
  activo: boolean("activo").default(true),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  deleted_at: timestamp("deleted_at"),
});
