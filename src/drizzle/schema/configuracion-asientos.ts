import { pgTable, serial, varchar, integer, decimal, text } from "drizzle-orm/pg-core";

export const configuracionAsientos = pgTable("configuracion_asientos", {
  id: serial("id").primaryKey(),
  busId: integer("bus_id").notNull(),
  tipoAsiento: varchar("tipo_asiento", { length: 20 }).notNull(), // VIP o Normal
  cantidad: integer("cantidad").notNull(),
  precioBase: decimal("precio_base", { precision: 10, scale: 2 }).notNull(),
  posicionesJson: text("posiciones_json").notNull(),
});
