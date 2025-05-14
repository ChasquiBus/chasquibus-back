import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const roles = pgTable('roles', {
  id: serial('id').primaryKey(),
  nombre: varchar('nombre', { length: 50 }),
});
