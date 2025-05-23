DROP INDEX "usuarios_email_unique";--> statement-breakpoint
DROP INDEX "usuarios_cedula_unique";--> statement-breakpoint
ALTER TABLE "usuario_cooperativa" ALTER COLUMN "cooperativa_transporte_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "usuarios" ALTER COLUMN "activo" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_email_unique" UNIQUE("email");--> statement-breakpoint
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_cedula_unique" UNIQUE("cedula");
ALTER TABLE "usuario_cooperativa" ADD CONSTRAINT "usuario_cooperativa_usuario_id_unique" UNIQUE("usuario_id");
