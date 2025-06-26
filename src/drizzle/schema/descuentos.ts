// descuentos.ts
import { pgTable, serial, integer, varchar, boolean, decimal } from 'drizzle-orm/pg-core';

export const descuentos = pgTable('descuentos', {
  id: serial('id').primaryKey(),
  tipoDescuento: varchar('tipo_descuento', { length: 100 }),
  requiereValidacion: boolean('requiere_validacion'),
  porcentaje: decimal('porcentaje', { precision: 5, scale: 2 }),
  estado: varchar('estado', { length: 50 })
});
