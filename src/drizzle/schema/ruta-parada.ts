// ruta-parada.ts
import { pgTable, serial, integer, varchar, boolean } from 'drizzle-orm/pg-core';
import { rutas } from './rutas';
import { paradas } from './paradas';

export const rutaParada = pgTable('ruta_parada', {
  id: serial('id').primaryKey(),
  rutaId: integer('ruta_id').references(() => rutas.id),
  paradaId: integer('parada_id').references(() => paradas.id),
  orden: integer('orden'),
  distanciaDesdeOrigenKm: integer('distancia_desde_origen_km'),
  tiempoDesdeOrigenMin: integer('tiempo_desde_origen_min'),
  estado: varchar('estado', { length: 50 }), // activa, inactiva, suspendida
});
