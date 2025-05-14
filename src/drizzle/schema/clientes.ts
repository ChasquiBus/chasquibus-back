import { boolean, date, integer, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { usuarios } from "./usuarios";

export const clientes = pgTable('clientes', {
  id: serial('id').primaryKey(),
  nombre: varchar('nombre', { length: 50 }),
  apellido: varchar('apellido', { length: 50 }),
  cedula: varchar('cedula', { length: 20 }),
  telefono: varchar('telefono', { length: 20 }),
  usuarioId: integer('usuario_id').references(() => usuarios.id),
  esDiscapacitado: boolean('es_discapacitado'),
  porcentajeDiscapacidad: integer('porcentaje_discapacidad'),
  estado: boolean('estado'),
  fechaNacimiento: date('fecha_nacimiento'),
  fechaRegistro: timestamp('fecha_registro'),
}); 

