ALTER TABLE "ciudades" ALTER COLUMN "provincia" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "ciudades" ALTER COLUMN "ciudad" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "paradas" ALTER COLUMN "estado" SET DATA TYPE boolean;--> statement-breakpoint
ALTER TABLE "ciudades" ADD COLUMN "cooperativa_id" integer;--> statement-breakpoint
ALTER TABLE "paradas" ADD COLUMN "cooperativa_id" integer;--> statement-breakpoint
ALTER TABLE "resoluciones_ant" ADD COLUMN "cooperativa_id" integer;--> statement-breakpoint
ALTER TABLE "ciudades" ADD CONSTRAINT "ciudades_cooperativa_id_cooperativa_transporte_id_fk" FOREIGN KEY ("cooperativa_id") REFERENCES "public"."cooperativa_transporte"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "paradas" ADD CONSTRAINT "paradas_cooperativa_id_cooperativa_transporte_id_fk" FOREIGN KEY ("cooperativa_id") REFERENCES "public"."cooperativa_transporte"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resoluciones_ant" ADD CONSTRAINT "resoluciones_ant_cooperativa_id_cooperativa_transporte_id_fk" FOREIGN KEY ("cooperativa_id") REFERENCES "public"."cooperativa_transporte"("id") ON DELETE no action ON UPDATE no action;