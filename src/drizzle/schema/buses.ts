import { pgTable, serial, varchar, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

export const buses = pgTable('buses', {
  id: serial('id').primaryKey(),
  cooperativa_id: integer('cooperativa_id').notNull(),
  chofer_id: integer('chofer_id').notNull(),
  placa: varchar('placa', { length: 10 }).notNull(),
  numero_bus: varchar('numero_bus', { length: 10 }).notNull(),
  marca_chasis: varchar('marca_chasis', { length: 50 }).notNull(),
  marca_carroceria: varchar('marca_carroceria', { length: 50 }).notNull(),
  imagen: varchar('imagen', { length: 255 }),
  piso_doble: boolean('piso_doble').notNull().default(false),
  activo: boolean('activo').notNull().default(true),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
  deleted_at: timestamp('deleted_at')
});
