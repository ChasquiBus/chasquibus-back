ALTER TABLE "buses" ADD COLUMN "total_asientos" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "configuracion_asientos" ADD CONSTRAINT "configuracion_asientos_bus_id_buses_id_fk" FOREIGN KEY ("bus_id") REFERENCES "public"."buses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "buses" DROP COLUMN "chofer_id";--> statement-breakpoint
ALTER TABLE "configuracion_asientos" DROP COLUMN "tipo_asiento";--> statement-breakpoint
ALTER TABLE "configuracion_asientos" DROP COLUMN "cantidad";--> statement-breakpoint
ALTER TABLE "configuracion_asientos" DROP COLUMN "precio_base";