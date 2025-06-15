ALTER TABLE "boletos" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "boletos" CASCADE;--> statement-breakpoint
ALTER TABLE "ventas" ADD COLUMN "horario_id" integer;--> statement-breakpoint
ALTER TABLE "ventas" ADD COLUMN "asiento_id" integer;--> statement-breakpoint
ALTER TABLE "ventas" ADD COLUMN "codigoQR" varchar(255);--> statement-breakpoint
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_horario_id_horarios_id_fk" FOREIGN KEY ("horario_id") REFERENCES "public"."horarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_asiento_id_configuracion_asientos_id_fk" FOREIGN KEY ("asiento_id") REFERENCES "public"."configuracion_asientos"("id") ON DELETE no action ON UPDATE no action;