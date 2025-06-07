ALTER TABLE "choferes" ALTER COLUMN "numero_licencia" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "choferes" ALTER COLUMN "tipo_licencia" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "choferes" ADD COLUMN "cooperativa_transporte_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "choferes" ADD CONSTRAINT "choferes_cooperativa_transporte_id_cooperativa_transporte_id_fk" FOREIGN KEY ("cooperativa_transporte_id") REFERENCES "public"."cooperativa_transporte"("id") ON DELETE no action ON UPDATE no action;