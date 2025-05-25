import { pgTable, serial, varchar, boolean, integer, timestamp } from 'drizzle-orm/pg-core';

export const buses = pgTable('buses', {
  id: serial('id').primaryKey(),
  cooperativaId: integer('cooperativa_id').notNull(),
  choferId: integer('chofer_id').notNull(),
  placa: varchar('placa', { length: 10 }).notNull(),
  numeroBus: varchar('numero_bus', { length: 10 }).notNull(),
  marcaChasis: varchar('marca_chasis', { length: 50 }),
  marcaCarroceria: varchar('marca_carroceria', { length: 50 }),
  imagen: varchar('imagen', { length: 255 }),
  pisoDoble: boolean('piso_doble').notNull(),
  activo: boolean('activo').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});
