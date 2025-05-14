import { pgTable, serial, varchar, boolean, timestamp, integer } from 'drizzle-orm/pg-core';
import { roles } from './roles';
import { usuarios } from './usuarios';
import { cooperativaTransporte } from './cooperativa-transporte';

export const usuarioCooperativa = pgTable('usuario_cooperativa', {
  id: serial('id').primaryKey(),
  cooperativaTransporteId: integer('cooperativa_transporte_id').references(() => cooperativaTransporte.id),
  usuarioId: integer('usuario_id').notNull().references(() => usuarios.id),
  rol: integer('rol').references(() => roles.id),
  estado: boolean('estado'),
  fechaRegistro: timestamp('fecha_registro'),
});