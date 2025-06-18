CREATE TABLE "provincias" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dias" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(50) NOT NULL,
	"codigo" varchar(10) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "frecuencia_dias" (
	"id" serial PRIMARY KEY NOT NULL,
	"frecuencia_id" integer NOT NULL,
	"dia_id" integer NOT NULL,
	"tipo" varchar(20) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tarifas" (
	"id" serial PRIMARY KEY NOT NULL,
	"ruta_id" integer NOT NULL,
	"parada_origen_id" integer NOT NULL,
	"parada_destino_id" integer NOT NULL,
	"tipo_asiento_id" integer NOT NULL,
	"valor" numeric(5, 2) NOT NULL,
	"fecha_ini_vigencia" date,
	"fecha_fin_vigencia" date,
	"estado" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "horarios" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "precios" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "resoluciones_ant" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "horarios" CASCADE;--> statement-breakpoint
DROP TABLE "precios" CASCADE;--> statement-breakpoint
DROP TABLE "resoluciones_ant" CASCADE;--> statement-breakpoint
ALTER TABLE "ciudades" DROP CONSTRAINT "ciudades_cooperativa_id_cooperativa_transporte_id_fk";
--> statement-breakpoint
ALTER TABLE "ventas" DROP CONSTRAINT "ventas_precio_id_precios_id_fk";
--> statement-breakpoint
ALTER TABLE "ventas" DROP CONSTRAINT "ventas_horario_id_horarios_id_fk";
--> statement-breakpoint
ALTER TABLE "ventas" DROP CONSTRAINT "ventas_asiento_id_configuracion_asientos_id_fk";
--> statement-breakpoint
ALTER TABLE "frecuencias" ALTER COLUMN "ruta_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "frecuencias" ALTER COLUMN "estado" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "hoja_trabajo" ALTER COLUMN "bus_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "hoja_trabajo" ALTER COLUMN "chofer_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "hoja_trabajo" ALTER COLUMN "estado" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "hoja_trabajo" ALTER COLUMN "estado" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "rutas" ALTER COLUMN "parada_origen_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "rutas" ALTER COLUMN "parada_destino_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "rutas" ALTER COLUMN "codigo" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "rutas" ALTER COLUMN "cooperativa_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "rutas" ALTER COLUMN "estado" SET DEFAULT true;--> statement-breakpoint
ALTER TABLE "rutas" ALTER COLUMN "estado" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "rutas" ALTER COLUMN "deleted_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "ciudades" ADD COLUMN "provincia_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "ciudades" ADD COLUMN "codigo" varchar(5);--> statement-breakpoint
ALTER TABLE "frecuencias" ADD COLUMN "hora_salida_prog" time NOT NULL;--> statement-breakpoint
ALTER TABLE "frecuencias" ADD COLUMN "hora_llegada_prog" time NOT NULL;--> statement-breakpoint
ALTER TABLE "frecuencias" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "frecuencias" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "frecuencias" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "hoja_trabajo" ADD COLUMN "frec_dia_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "hoja_trabajo" ADD COLUMN "hora_salida_real" timestamp;--> statement-breakpoint
ALTER TABLE "hoja_trabajo" ADD COLUMN "hora_llegada_real" timestamp;--> statement-breakpoint
ALTER TABLE "hoja_trabajo" ADD COLUMN "fecha_salida" date;--> statement-breakpoint
ALTER TABLE "rutas" ADD COLUMN "prioridad" integer;--> statement-breakpoint
ALTER TABLE "rutas" ADD COLUMN "resolucion_url" varchar(255) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "rutas" ADD COLUMN "fecha_ini_vigencia" date;--> statement-breakpoint
ALTER TABLE "rutas" ADD COLUMN "fecha_fin_vigencia" date;--> statement-breakpoint
ALTER TABLE "ventas" ADD COLUMN "comprobanteurl" varchar(255);--> statement-breakpoint
ALTER TABLE "ventas" ADD COLUMN "fecha_venta" timestamp (3);--> statement-breakpoint
ALTER TABLE "ventas" ADD COLUMN "tipo_venta" varchar(20);--> statement-breakpoint
ALTER TABLE "ventas" ADD COLUMN "total_sin_desc" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "ventas" ADD COLUMN "total_desc" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "ventas" ADD COLUMN "total_final" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "ventas" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "ventas" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "frecuencia_dias" ADD CONSTRAINT "frecuencia_dias_frecuencia_id_frecuencias_id_fk" FOREIGN KEY ("frecuencia_id") REFERENCES "public"."frecuencias"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "frecuencia_dias" ADD CONSTRAINT "frecuencia_dias_dia_id_dias_id_fk" FOREIGN KEY ("dia_id") REFERENCES "public"."dias"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tarifas" ADD CONSTRAINT "tarifas_ruta_id_rutas_id_fk" FOREIGN KEY ("ruta_id") REFERENCES "public"."rutas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tarifas" ADD CONSTRAINT "tarifas_parada_origen_id_paradas_id_fk" FOREIGN KEY ("parada_origen_id") REFERENCES "public"."paradas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tarifas" ADD CONSTRAINT "tarifas_parada_destino_id_paradas_id_fk" FOREIGN KEY ("parada_destino_id") REFERENCES "public"."paradas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tarifas" ADD CONSTRAINT "tarifas_tipo_asiento_id_configuracion_asientos_id_fk" FOREIGN KEY ("tipo_asiento_id") REFERENCES "public"."configuracion_asientos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ciudades" ADD CONSTRAINT "ciudades_provincia_id_provincias_id_fk" FOREIGN KEY ("provincia_id") REFERENCES "public"."provincias"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hoja_trabajo" ADD CONSTRAINT "hoja_trabajo_frec_dia_id_frecuencia_dias_id_fk" FOREIGN KEY ("frec_dia_id") REFERENCES "public"."frecuencia_dias"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ciudades" DROP COLUMN "provincia";--> statement-breakpoint
ALTER TABLE "ciudades" DROP COLUMN "cooperativa_id";--> statement-breakpoint
ALTER TABLE "frecuencias" DROP COLUMN "dias_operacion";--> statement-breakpoint
ALTER TABLE "frecuencias" DROP COLUMN "dias_parada";--> statement-breakpoint
ALTER TABLE "frecuencias" DROP COLUMN "fecha_ini_vigencia";--> statement-breakpoint
ALTER TABLE "frecuencias" DROP COLUMN "fecha_fin_vigencia";--> statement-breakpoint
ALTER TABLE "rutas" DROP COLUMN "resolucion_id";--> statement-breakpoint
ALTER TABLE "rutas" DROP COLUMN "nombre";--> statement-breakpoint
ALTER TABLE "rutas" DROP COLUMN "distancia_km";--> statement-breakpoint
ALTER TABLE "rutas" DROP COLUMN "duracion_estimada_min";--> statement-breakpoint
ALTER TABLE "ventas" DROP COLUMN "precio_id";--> statement-breakpoint
ALTER TABLE "ventas" DROP COLUMN "horario_id";--> statement-breakpoint
ALTER TABLE "ventas" DROP COLUMN "asiento_id";--> statement-breakpoint
ALTER TABLE "ventas" DROP COLUMN "codigoQR";--> statement-breakpoint
ALTER TABLE "ventas" DROP COLUMN "comprobanteUrl";--> statement-breakpoint
ALTER TABLE "ventas" DROP COLUMN "fechaVenta";--> statement-breakpoint
ALTER TABLE "ventas" DROP COLUMN "totalSinDescuento";--> statement-breakpoint
ALTER TABLE "ventas" DROP COLUMN "totalDescuentos";--> statement-breakpoint
ALTER TABLE "ventas" DROP COLUMN "totalFinal";