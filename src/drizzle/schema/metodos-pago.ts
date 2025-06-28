// metodos-pago.ts
import { pgTable, serial, varchar, boolean, text, integer } from 'drizzle-orm/pg-core';
import { cooperativaTransporte } from './cooperativa-transporte';

export const metodosPago = pgTable('metodos_pago', {
  id: serial('id').primaryKey(),
  cooperativaId: integer('cooperativa_id').notNull().references(() => cooperativaTransporte.id),  
  nombre: varchar('nombre', { length: 100 }),
  descripcion: varchar('descripcion', { length: 255 }),
  procesador: varchar('procesador', { length: 100 }),
  configuracion: text('configuracion'),
  activo: boolean('activo')
});
