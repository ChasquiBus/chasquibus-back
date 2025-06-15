// rutas.ts
import { pgTable, serial, integer, varchar, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { paradas } from './paradas';
import { resolucionesAnt } from './resoluciones-ant';
import { cooperativaTransporte } from './cooperativa-transporte';

export const rutas = pgTable('rutas', {
  id: serial('id').primaryKey(),
  paradaOrigenId: integer('parada_origen_id').references(() => paradas.id),
  paradaDestinoId: integer('parada_destino_id').references(() => paradas.id),
  resolucionId: integer('resolucion_id').references(() => resolucionesAnt.id),
  nombre: varchar('nombre', { length: 255 }),
  codigo: varchar('codigo', { length: 50 }),
  cooperativaId: integer('cooperativa_id').references(() => cooperativaTransporte.id),
  distanciaKm: integer('distancia_km'),
  estado: boolean('estado'),
  duracionEstimadaMin: text('duracion_estimada_min'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at')
});