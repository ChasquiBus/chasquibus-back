import { boolean, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";


export const cooperativaTransporte = pgTable('cooperativa_transporte', {
  id: serial('id').primaryKey(),
  nombre: varchar('nombre', { length: 100 }),
  logo: varchar('logo', { length: 50 }),
  colorPrimario: varchar('color_primario', { length: 20 }),
  colorSecundario: varchar('color_secundario', { length: 20 }),
  email: varchar('email', { length: 100 }),
  telefono: varchar('telefono', { length: 20 }),
  fechaRegistro: timestamp('fecha_registro'),
  estado: boolean('estado'),
});