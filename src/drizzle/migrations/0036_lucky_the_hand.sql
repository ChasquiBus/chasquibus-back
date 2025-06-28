ALTER TABLE "boletos" DROP CONSTRAINT "boletos_configuracion_asientos_configuracion_asientos_id_fk";
--> statement-breakpoint
ALTER TABLE "boletos" DROP COLUMN "configuracion_asientos";--> statement-breakpoint
ALTER TABLE "boletos" DROP COLUMN "posiciones_json";