// frecuencias.ts
import { pgTable, serial, integer, json, date, varchar } from 'drizzle-orm/pg-core';

export const frecuencias = pgTable('frecuencias', {
  id: serial('id').primaryKey(),
  cooperativaId: integer('cooperativa_id'),
  diasOperacion: json('dias_operacion'), // ej: {'lun':true,'mar':true}
  diasParada: json('dias_parada'),
  fechaIniVigencia: date('fecha_ini_vigencia'),
  fechaFinVigencia: date('fecha_fin_vigencia'),
  estado: varchar('estado', { length: 50 }) // Activa, Inactiva, Suspendida
});
