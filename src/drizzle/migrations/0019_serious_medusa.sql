ALTER TABLE "precios" RENAME COLUMN "ruta_parada_origen_id" TO "parada_origen_id";--> statement-breakpoint
ALTER TABLE "precios" RENAME COLUMN "ruta_parada_destino_id" TO "parada_destino_id";--> statement-breakpoint
ALTER TABLE "precios" DROP CONSTRAINT "precios_ruta_parada_origen_id_ruta_parada_id_fk";
--> statement-breakpoint
ALTER TABLE "precios" DROP CONSTRAINT "precios_ruta_parada_destino_id_ruta_parada_id_fk";
--> statement-breakpoint
ALTER TABLE "precios" ADD CONSTRAINT "precios_parada_origen_id_paradas_id_fk" FOREIGN KEY ("parada_origen_id") REFERENCES "public"."paradas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "precios" ADD CONSTRAINT "precios_parada_destino_id_paradas_id_fk" FOREIGN KEY ("parada_destino_id") REFERENCES "public"."paradas"("id") ON DELETE no action ON UPDATE no action;