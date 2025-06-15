ALTER TABLE "hoja_trabajo" DROP CONSTRAINT "hoja_trabajo_controlador_id_usuarios_id_fk";
--> statement-breakpoint
ALTER TABLE "horarios" ADD COLUMN "estado" varchar(50);--> statement-breakpoint
ALTER TABLE "hoja_trabajo" DROP COLUMN "controlador_id";