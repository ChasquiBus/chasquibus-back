CREATE TABLE "configuracion_asientos" (
	"id" serial PRIMARY KEY NOT NULL,
	"bus_id" integer NOT NULL,
	"tipo_asiento" varchar(20) NOT NULL,
	"cantidad" integer NOT NULL,
	"precio_base" numeric(10, 2) NOT NULL,
	"posiciones_json" text NOT NULL
);
