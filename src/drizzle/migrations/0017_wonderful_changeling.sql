ALTER TABLE "resoluciones_ant" ADD COLUMN "en_uso" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "resoluciones_ant" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "resoluciones_ant" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "resoluciones_ant" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "rutas" ADD COLUMN "estado" boolean;