CREATE TABLE "choferes" (
	"id" serial PRIMARY KEY NOT NULL,
	"usuario_id" integer NOT NULL,
	"numero_licencia" varchar(100),
	"tipo_licencia" varchar(100),
	"tipo_sangre" varchar(100),
	"fecha_nacimiento" date
);
--> statement-breakpoint
ALTER TABLE "usuarios" RENAME COLUMN "password" TO "password_hash";--> statement-breakpoint
ALTER TABLE "clientes" ALTER COLUMN "usuario_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "clientes" ALTER COLUMN "es_discapacitado" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "cooperativa_transporte" ALTER COLUMN "nombre" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "cooperativa_transporte" ALTER COLUMN "logo" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "cooperativa_transporte" ADD COLUMN "activo" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "cooperativa_transporte" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "cooperativa_transporte" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "cooperativa_transporte" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "usuario_cooperativa" ADD COLUMN "rol" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "usuarios" ADD COLUMN "nombre" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "usuarios" ADD COLUMN "apellido" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "usuarios" ADD COLUMN "cedula" varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE "usuarios" ADD COLUMN "telefono" varchar(20);--> statement-breakpoint
ALTER TABLE "usuarios" ADD COLUMN "activo" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "usuarios" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "usuarios" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "usuarios" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "choferes" ADD CONSTRAINT "choferes_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clientes" DROP COLUMN "nombre";--> statement-breakpoint
ALTER TABLE "clientes" DROP COLUMN "apellido";--> statement-breakpoint
ALTER TABLE "clientes" DROP COLUMN "cedula";--> statement-breakpoint
ALTER TABLE "clientes" DROP COLUMN "telefono";--> statement-breakpoint
ALTER TABLE "clientes" DROP COLUMN "estado";--> statement-breakpoint
ALTER TABLE "clientes" DROP COLUMN "fecha_registro";--> statement-breakpoint
ALTER TABLE "cooperativa_transporte" DROP COLUMN "fecha_registro";--> statement-breakpoint
ALTER TABLE "cooperativa_transporte" DROP COLUMN "estado";--> statement-breakpoint
ALTER TABLE "usuario_cooperativa" DROP COLUMN "estado";--> statement-breakpoint
ALTER TABLE "usuario_cooperativa" DROP COLUMN "fecha_registro";--> statement-breakpoint
ALTER TABLE "usuarios" DROP COLUMN "estado";--> statement-breakpoint
ALTER TABLE "usuarios" DROP COLUMN "rol";