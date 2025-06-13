// precios.ts
import { pgTable, serial, integer, decimal } from 'drizzle-orm/pg-core';
import { rutaParada } from './ruta-parada';

export const precios = pgTable('precios', {
  id: serial('id').primaryKey(),
  rutaParadaOrigenId: integer('ruta_parada_origen_id').references(() => rutaParada.id),
  rutaParadaDestinoId: integer('ruta_parada_destino_id').references(() => rutaParada.id),
  distanciaKm: integer('distancia_km'),
  tiempoEstimadoMin: integer('tiempo_estimado_min'),
  costo: decimal('costo', { precision: 10, scale: 2 })
});
