// boletos.ts
import { pgTable, serial, integer, varchar } from 'drizzle-orm/pg-core';
import { ventas } from './ventas';
import { horarios } from './horarios';
import { configuracionAsientos } from './configuracion-asientos';
import { descuentos } from './descuentos';

export const boletos = pgTable('boletos', {
  id: serial('id').primaryKey(),
  cooperativaId: integer('cooperativa_id'),
  ventaId: integer('venta_id').references(() => ventas.id),
  asientoId: integer('asiento_id').references(() => configuracionAsientos.id),
  horarioId: integer('horario_id').references(() => horarios.id),
  tipoDescuento: integer('tipo_descuento').references(() => descuentos.id),
  estadoBoleto: varchar('estado_boleto', { length: 50 })
});
