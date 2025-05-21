import { boolean, date, integer, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { usuarios } from "./usuarios";

export const clientes = pgTable('clientes', {
  id: serial("id").primaryKey(),
  usuarioId: integer("usuario_id").notNull().references(() => usuarios.id),
  esDiscapacitado: boolean("es_discapacitado").default(false),
  porcentajeDiscapacidad: integer("porcentaje_discapacidad"),
  fechaNacimiento: date("fecha_nacimiento"),
}); 

