import {  date, integer, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { usuarios } from "./usuarios";

export const choferes = pgTable("choferes", {
  id: serial("id").primaryKey(),
  usuarioId: integer("usuario_id").notNull().references(() => usuarios.id),
  numeroLicencia: varchar("numero_licencia", { length: 100 }),
  tipoLicencia: varchar("tipo_licencia", { length: 100 }),
  tipoSangre: varchar("tipo_sangre", { length: 100 }),
  fechaNacimiento: date("fecha_nacimiento"),
});