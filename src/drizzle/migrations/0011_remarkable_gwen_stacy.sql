CREATE TABLE "buses" (
	"id" serial PRIMARY KEY NOT NULL,
	"cooperativa_id" integer NOT NULL,
	"chofer_id" integer NOT NULL,
	"placa" varchar(10) NOT NULL,
	"numero_bus" varchar(10) NOT NULL,
	"marca_chasis" varchar(50),
	"marca_carroceria" varchar(50),
	"imagen" varchar(255),
	"piso_doble" boolean DEFAULT false,
	"activo" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp
);
