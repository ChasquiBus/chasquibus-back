// frecuencias.ts
import { pgTable, serial, integer, json, date, varchar } from 'drizzle-orm/pg-core';
import { rutas } from './rutas';

export const frecuencias = pgTable('frecuencias', {
  id: serial('id').primaryKey(),
  rutaId: integer('ruta_id').references(() => rutas.id),
  diasOperacion: json('dias_operacion'),
  diasParada: json('dias_parada'),
  fechaIniVigencia: date('fecha_ini_vigencia'),
  fechaFinVigencia: date('fecha_fin_vigencia'),
  estado: varchar('estado', { length: 50 })
});
