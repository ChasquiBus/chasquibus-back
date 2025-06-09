// metodos-pago.ts
import { pgTable, serial, varchar, boolean } from 'drizzle-orm/pg-core';

export const metodosPago = pgTable('metodos_pago', {
  id: serial('id').primaryKey(),
  nombre: varchar('nombre', { length: 100 }),
  descripcion: varchar('descripcion', { length: 255 }),
  procesador: varchar('procesador', { length: 100 }),
  configuracion: varchar('configuracion', { length: 255 }),
  activo: boolean('activo')
});
