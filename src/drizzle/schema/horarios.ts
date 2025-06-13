// horarios.ts
import { pgTable, serial, integer, date, timestamp } from 'drizzle-orm/pg-core';
import { frecuencias } from './frecuencias';
import { hojaTrabajo } from './hoja-trabajo';

export const horarios = pgTable('horarios', {
  id: serial('id').primaryKey(),
  frecuenciaId: integer('frecuencia_id').references(() => frecuencias.id),
  fechaSalida: date('fecha_salida'),
  fechaLlegada: date('fecha_llegada'),
  hojaTrabajoId: integer('hoja_trabajo_id').references(() => hojaTrabajo.id),
  horaSalidaProg: timestamp('hora_salida_prog'),
  horaLlegadaProg: timestamp('hora_llegada_prog'),
  horaSalidaReal: timestamp('hora_salida_real'),
  horaLlegadaReal: timestamp('hora_llegada_real')
});
