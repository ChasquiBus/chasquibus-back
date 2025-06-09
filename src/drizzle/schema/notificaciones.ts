// notificaciones.ts
import { pgTable, serial, integer, varchar, text, boolean, timestamp } from 'drizzle-orm/pg-core';

export const notificaciones = pgTable('notificaciones', {
  id: serial('id').primaryKey(),
  cooperativaId: integer('cooperativa_id'),
  usuarioId: integer('usuario_id'),
  tipo: varchar('tipo', { length: 100 }),
  titulo: text('titulo'),
  mensaje: text('mensaje'),
  entidadRelacionada: varchar('entidad_relacionada', { length: 100 }),
  entidadId: integer('entidad_id'),
  accionUrl: varchar('accion_url', { length: 255 }),
  leida: boolean('leida'),
  fechaCreacion: timestamp('fecha_creacion', { precision: 3 }),
  fechaLectura: timestamp('fecha_lectura', { precision: 3 })
});
