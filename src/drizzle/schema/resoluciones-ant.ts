import { boolean, date, integer, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { cooperativaTransporte } from "./cooperativa-transporte";


export const resolucionesAnt = pgTable('resoluciones_ant', {
  id: serial('id').primaryKey(),
  documentoURL: varchar('documentoURL', { length: 150 }),
  nombre: varchar('nombre', { length: 150 }),
  descripcion: varchar('descripcion', { length: 150 }),
  fechaEmision: date('fecha_emision'),
  fechaVencimiento: date('fecha_vencimiento'),
  estado: boolean('estado'),
  enUso: boolean('en_uso').default(true), //1=En uso, 0=No en uso
  cooperativaId: integer('cooperativa_id').references(() => cooperativaTransporte.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at')
});
