ALTER TABLE "tarifas" ALTER COLUMN "aplica_tarifa" SET DEFAULT true;--> statement-breakpoint
ALTER TABLE "buses" ADD COLUMN "en_uso" boolean DEFAULT false NOT NULL;