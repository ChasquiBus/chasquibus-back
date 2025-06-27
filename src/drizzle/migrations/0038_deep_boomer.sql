ALTER TABLE "boletos" DROP CONSTRAINT "boletos_hoja_trabajo_hoja_trabajo_id_fk";
--> statement-breakpoint
ALTER TABLE "ventas" ADD COLUMN "hoja_trabajo" integer;--> statement-breakpoint
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_hoja_trabajo_hoja_trabajo_id_fk" FOREIGN KEY ("hoja_trabajo") REFERENCES "public"."hoja_trabajo"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "boletos" DROP COLUMN "hoja_trabajo";