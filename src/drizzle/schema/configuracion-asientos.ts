import { pgTable, serial, integer, text } from 'drizzle-orm/pg-core';
import { buses } from '../schema/bus';

export const configuracionAsientos = pgTable('configuracion_asientos', {
  id: serial('id').primaryKey(),
  busId: integer('bus_id').references(() => buses.id).notNull(),
  posicionesJson: text('posiciones_json').notNull(),
});
