ALTER TABLE "boletos" RENAME COLUMN "asiento_id" TO "numero_asiento";--> statement-breakpoint
ALTER TABLE "boletos" DROP CONSTRAINT "boletos_asiento_id_configuracion_asientos_id_fk";
--> statement-breakpoint
ALTER TABLE "descuentos" DROP COLUMN "cooperativa_id";