ALTER TABLE "frecuencia_dias" RENAME TO "ruta_dias";--> statement-breakpoint
ALTER TABLE "ruta_dias" RENAME COLUMN "frecuencia_id" TO "ruta_id";--> statement-breakpoint
ALTER TABLE "ruta_dias" DROP CONSTRAINT "frecuencia_dias_frecuencia_id_frecuencias_id_fk";
--> statement-breakpoint
ALTER TABLE "ruta_dias" DROP CONSTRAINT "frecuencia_dias_dia_id_dias_id_fk";
--> statement-breakpoint
ALTER TABLE "hoja_trabajo" DROP CONSTRAINT "hoja_trabajo_frec_dia_id_frecuencia_dias_id_fk";
--> statement-breakpoint
ALTER TABLE "ruta_dias" ADD CONSTRAINT "ruta_dias_ruta_id_rutas_id_fk" FOREIGN KEY ("ruta_id") REFERENCES "public"."rutas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ruta_dias" ADD CONSTRAINT "ruta_dias_dia_id_dias_id_fk" FOREIGN KEY ("dia_id") REFERENCES "public"."dias"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hoja_trabajo" ADD CONSTRAINT "hoja_trabajo_frec_dia_id_frecuencias_id_fk" FOREIGN KEY ("frec_dia_id") REFERENCES "public"."frecuencias"("id") ON DELETE no action ON UPDATE no action;