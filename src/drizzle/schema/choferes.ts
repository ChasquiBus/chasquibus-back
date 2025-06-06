import {  date, integer, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { usuarios } from "./usuarios";
import { cooperativaTransporte } from "./cooperativa-transporte";

export const choferes = pgTable("choferes", {
  id: serial("id").primaryKey(),
  usuarioId: integer("usuario_id").notNull().references(() => usuarios.id),
  numeroLicencia: varchar("numero_licencia", { length: 100 }).notNull(),
  tipoLicencia: varchar("tipo_licencia", { length: 100 }).notNull(),
  tipoSangre: varchar("tipo_sangre", { length: 100 }),
  fechaNacimiento: date("fecha_nacimiento"),
  cooperativaTransporteId: integer("cooperativa_transporte_id").notNull().references(() => cooperativaTransporte.id),
});