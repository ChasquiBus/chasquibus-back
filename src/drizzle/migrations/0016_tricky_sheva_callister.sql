ALTER TABLE "rutas" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "rutas" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "rutas" ADD COLUMN "deleted_at" timestamp;