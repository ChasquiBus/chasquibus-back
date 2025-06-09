import { boolean, date, pgTable, serial, varchar } from "drizzle-orm/pg-core";


export const resolucionesAnt = pgTable('resoluciones_ant', {
  id: serial('id').primaryKey(),
  documentoURL: varchar('documentoURL', { length: 150 }),
  fechaEmision: date('fecha_emision'),
  fechaVencimiento: date('fecha_vencimiento'),
  estado: boolean('estado')
});
