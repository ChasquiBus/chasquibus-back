// precios.ts
import { pgTable, serial, integer, decimal } from 'drizzle-orm/pg-core';
import { paradas } from './paradas';

export const precios = pgTable('precios', {
  id: serial('id').primaryKey(),
  ParadaOrigenId: integer('parada_origen_id').references(() => paradas.id).notNull(),
  ParadaDestinoId: integer('parada_destino_id').references(() => paradas.id).notNull(),
  distanciaKm: integer('distancia_km'),
  tiempoEstimadoMin: integer('tiempo_estimado_min'),
  costo: decimal('costo', { precision: 10, scale: 2 })
});
