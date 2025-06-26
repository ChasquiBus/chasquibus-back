import { pgTable, serial, integer, varchar } from 'drizzle-orm/pg-core';
import { dias } from './dias';
import { rutas } from './rutas';

export const rutaDias = pgTable('ruta_dias', {
  id: serial('id').primaryKey(),
  rutaId: integer('ruta_id').notNull().references(() => rutas.id),
  diaId: integer('dia_id').notNull().references(() => dias.id),
  tipo: varchar('tipo', { length: 20 }).notNull() // Ej: 'operacion', 'parada'
});
// Esta tabla relaciona las frecuencias con los días de la semana, permitiendo que una frecuencia
// pueda tener múltiples días asociados. Esto es útil para definir qué días de la semana    