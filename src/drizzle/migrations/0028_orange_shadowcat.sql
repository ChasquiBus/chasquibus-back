ALTER TABLE "tarifas" DROP CONSTRAINT "tarifas_tipo_asiento_id_configuracion_asientos_id_fk";
--> statement-breakpoint
ALTER TABLE "tarifas" ADD COLUMN "tipo_asiento" varchar(10);--> statement-breakpoint
ALTER TABLE "tarifas" ADD COLUMN "aplica_tarifa" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "tarifas" DROP COLUMN "tipo_asiento_id";--> statement-breakpoint
ALTER TABLE "tarifas" DROP COLUMN "fecha_ini_vigencia";--> statement-breakpoint
ALTER TABLE "tarifas" DROP COLUMN "fecha_fin_vigencia";--> statement-breakpoint
ALTER TABLE "tarifas" DROP COLUMN "estado";--> statement-breakpoint
ALTER TABLE "tarifas" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "tarifas" DROP COLUMN "updated_at";