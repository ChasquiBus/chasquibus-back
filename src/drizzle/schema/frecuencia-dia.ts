import { pgTable, serial, integer, varchar } from 'drizzle-orm/pg-core';
import { frecuencias } from './frecuencias';
import { dias } from './dias';

export const frecuenciaDias = pgTable('frecuencia_dias', {
  id: serial('id').primaryKey(),
  frecuenciaId: integer('frecuencia_id').notNull().references(() => frecuencias.id),
  diaId: integer('dia_id').notNull().references(() => dias.id),
  tipo: varchar('tipo', { length: 20 }).notNull() // Ej: 'operacion', 'parada'
});
// Esta tabla relaciona las frecuencias con los días de la semana, permitiendo que una frecuencia
// pueda tener múltiples días asociados. Esto es útil para definir qué días de la semana    