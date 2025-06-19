ALTER TABLE "frecuencias" ADD COLUMN "en_uso" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "rutas" DROP COLUMN "en_uso";