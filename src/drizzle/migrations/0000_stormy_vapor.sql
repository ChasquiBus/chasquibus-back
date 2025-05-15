CREATE TABLE "clientes" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(50),
	"apellido" varchar(50),
	"cedula" varchar(20),
	"telefono" varchar(20),
	"usuario_id" integer,
	"es_discapacitado" boolean,
	"porcentaje_discapacidad" integer,
	"estado" boolean,
	"fecha_nacimiento" date,
	"fecha_registro" timestamp
);
--> statement-breakpoint
CREATE TABLE "cooperativa_transporte" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(100),
	"logo" varchar(100),
	"color_primario" varchar(20),
	"color_secundario" varchar(20),
	"email" varchar(100),
	"telefono" varchar(20),
	"fecha_registro" timestamp,
	"estado" boolean
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(20)
);
--> statement-breakpoint
CREATE TABLE "usuario_cooperativa" (
	"id" serial PRIMARY KEY NOT NULL,
	"cooperativa_transporte_id" integer,
	"usuario_id" integer NOT NULL,
	"rol" integer,
	"estado" boolean,
	"fecha_registro" timestamp
);
--> statement-breakpoint
CREATE TABLE "usuarios" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(100) NOT NULL,
	"password" varchar(255) NOT NULL,
	"estado" boolean DEFAULT true
);
--> statement-breakpoint
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usuario_cooperativa" ADD CONSTRAINT "usuario_cooperativa_cooperativa_transporte_id_cooperativa_transporte_id_fk" FOREIGN KEY ("cooperativa_transporte_id") REFERENCES "public"."cooperativa_transporte"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usuario_cooperativa" ADD CONSTRAINT "usuario_cooperativa_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usuario_cooperativa" ADD CONSTRAINT "usuario_cooperativa_rol_roles_id_fk" FOREIGN KEY ("rol") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;