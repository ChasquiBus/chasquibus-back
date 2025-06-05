ALTER TABLE "roles" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "roles" CASCADE;--> statement-breakpoint
ALTER TABLE "usuario_cooperativa" DROP CONSTRAINT "usuario_cooperativa_rol_roles_id_fk";
--> statement-breakpoint
ALTER TABLE "usuarios" ADD COLUMN "rol" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "usuario_cooperativa" DROP COLUMN "rol";