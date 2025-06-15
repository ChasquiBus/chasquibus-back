ALTER TABLE "resoluciones_ant" ADD COLUMN "nombre" varchar(150);--> statement-breakpoint
ALTER TABLE "resoluciones_ant" ADD COLUMN "descripcion" varchar(150);--> statement-breakpoint
ALTER TABLE "ruta_parada" DROP COLUMN "es_terminal";