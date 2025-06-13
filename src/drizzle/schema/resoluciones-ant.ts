import { boolean, date, integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { cooperativaTransporte } from "./cooperativa-transporte";


export const resolucionesAnt = pgTable('resoluciones_ant', {
  id: serial('id').primaryKey(),
  documentoURL: varchar('documentoURL', { length: 150 }),
  fechaEmision: date('fecha_emision'),
  fechaVencimiento: date('fecha_vencimiento'),
  estado: boolean('estado'),
  cooperativaId: integer('cooperativa_id').references(() => cooperativaTransporte.id),

});
