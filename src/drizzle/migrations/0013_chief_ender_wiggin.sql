CREATE TABLE "boletos" (
	"id" serial PRIMARY KEY NOT NULL,
	"cooperativa_id" integer,
	"venta_id" integer,
	"asiento_id" integer,
	"horario_id" integer,
	"tipo_descuento" integer,
	"estado_boleto" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "ciudades" (
	"id" serial PRIMARY KEY NOT NULL,
	"provincia" varchar(255),
	"ciudad" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "descuentos" (
	"id" serial PRIMARY KEY NOT NULL,
	"cooperativa_id" integer,
	"tipo_descuento" varchar(100),
	"requiere_validacion" boolean,
	"porcentaje" numeric(5, 2),
	"estado" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "frecuencias" (
	"id" serial PRIMARY KEY NOT NULL,
	"ruta_id" integer,
	"dias_operacion" json,
	"dias_parada" json,
	"fecha_ini_vigencia" date,
	"fecha_fin_vigencia" date,
	"estado" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "hoja_trabajo" (
	"id" serial PRIMARY KEY NOT NULL,
	"bus_id" integer,
	"chofer_id" integer,
	"controlador_id" integer,
	"observaciones" varchar(255),
	"estado" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "horarios" (
	"id" serial PRIMARY KEY NOT NULL,
	"frecuencia_id" integer,
	"fecha_salida" date,
	"fecha_llegada" date,
	"hoja_trabajo_id" integer,
	"hora_salida_prog" timestamp,
	"hora_llegada_prog" timestamp,
	"hora_salida_real" timestamp,
	"hora_llegada_real" timestamp
);
--> statement-breakpoint
CREATE TABLE "metodos_pago" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(100),
	"descripcion" varchar(255),
	"procesador" varchar(100),
	"configuracion" varchar(255),
	"activo" boolean
);
--> statement-breakpoint
CREATE TABLE "notificaciones" (
	"id" serial PRIMARY KEY NOT NULL,
	"cooperativa_id" integer,
	"usuario_id" integer,
	"tipo" varchar(100),
	"titulo" text,
	"mensaje" text,
	"entidad_relacionada" varchar(100),
	"entidad_id" integer,
	"accion_url" varchar(255),
	"leida" boolean,
	"fecha_creacion" timestamp (3),
	"fecha_lectura" timestamp (3)
);
--> statement-breakpoint
CREATE TABLE "paradas" (
	"id" serial PRIMARY KEY NOT NULL,
	"ciudad_id" integer,
	"nombre_parada" varchar(255),
	"direccion" varchar(255),
	"estado" varchar(50),
	"es_terminal" boolean
);
--> statement-breakpoint
CREATE TABLE "precios" (
	"id" serial PRIMARY KEY NOT NULL,
	"ruta_parada_origen_id" integer,
	"ruta_parada_destino_id" integer,
	"distancia_km" integer,
	"tiempo_estimado_min" integer,
	"costo" numeric(10, 2)
);
--> statement-breakpoint
CREATE TABLE "resoluciones_ant" (
	"id" serial PRIMARY KEY NOT NULL,
	"documentoURL" varchar(150),
	"fecha_emision" date,
	"fecha_vencimiento" date,
	"estado" boolean
);
--> statement-breakpoint
CREATE TABLE "ruta_parada" (
	"id" serial PRIMARY KEY NOT NULL,
	"ruta_id" integer,
	"parada_id" integer,
	"orden" integer,
	"distancia_desde_origen_km" integer,
	"tiempo_desde_origen_min" integer,
	"estado" varchar(50),
	"es_terminal" boolean
);
--> statement-breakpoint
CREATE TABLE "rutas" (
	"id" serial PRIMARY KEY NOT NULL,
	"parada_origen_id" integer,
	"parada_destino_id" integer,
	"resolucion_id" integer,
	"nombre" varchar(255),
	"codigo" varchar(50),
	"cooperativa_id" integer,
	"distancia_km" integer,
	"duracion_estimada_min" text
);
--> statement-breakpoint
CREATE TABLE "ventas" (
	"id" serial PRIMARY KEY NOT NULL,
	"cooperativa_id" integer,
	"cliente_id" integer,
	"oficinista_id" integer,
	"precio_id" integer,
	"metodo_pago_id" integer,
	"estado_pago" varchar(50),
	"comprobanteUrl" varchar(255),
	"fechaVenta" timestamp (3),
	"totalSinDescuento" numeric(10, 2),
	"totalDescuentos" numeric(10, 2),
	"totalFinal" numeric(10, 2)
);
--> statement-breakpoint
ALTER TABLE "boletos" ADD CONSTRAINT "boletos_cooperativa_id_cooperativa_transporte_id_fk" FOREIGN KEY ("cooperativa_id") REFERENCES "public"."cooperativa_transporte"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "boletos" ADD CONSTRAINT "boletos_venta_id_ventas_id_fk" FOREIGN KEY ("venta_id") REFERENCES "public"."ventas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "boletos" ADD CONSTRAINT "boletos_asiento_id_configuracion_asientos_id_fk" FOREIGN KEY ("asiento_id") REFERENCES "public"."configuracion_asientos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "boletos" ADD CONSTRAINT "boletos_horario_id_horarios_id_fk" FOREIGN KEY ("horario_id") REFERENCES "public"."horarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "boletos" ADD CONSTRAINT "boletos_tipo_descuento_descuentos_id_fk" FOREIGN KEY ("tipo_descuento") REFERENCES "public"."descuentos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "frecuencias" ADD CONSTRAINT "frecuencias_ruta_id_rutas_id_fk" FOREIGN KEY ("ruta_id") REFERENCES "public"."rutas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hoja_trabajo" ADD CONSTRAINT "hoja_trabajo_bus_id_buses_id_fk" FOREIGN KEY ("bus_id") REFERENCES "public"."buses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hoja_trabajo" ADD CONSTRAINT "hoja_trabajo_chofer_id_choferes_id_fk" FOREIGN KEY ("chofer_id") REFERENCES "public"."choferes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hoja_trabajo" ADD CONSTRAINT "hoja_trabajo_controlador_id_usuarios_id_fk" FOREIGN KEY ("controlador_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "horarios" ADD CONSTRAINT "horarios_frecuencia_id_frecuencias_id_fk" FOREIGN KEY ("frecuencia_id") REFERENCES "public"."frecuencias"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "horarios" ADD CONSTRAINT "horarios_hoja_trabajo_id_hoja_trabajo_id_fk" FOREIGN KEY ("hoja_trabajo_id") REFERENCES "public"."hoja_trabajo"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_cooperativa_id_cooperativa_transporte_id_fk" FOREIGN KEY ("cooperativa_id") REFERENCES "public"."cooperativa_transporte"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "paradas" ADD CONSTRAINT "paradas_ciudad_id_ciudades_id_fk" FOREIGN KEY ("ciudad_id") REFERENCES "public"."ciudades"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "precios" ADD CONSTRAINT "precios_ruta_parada_origen_id_ruta_parada_id_fk" FOREIGN KEY ("ruta_parada_origen_id") REFERENCES "public"."ruta_parada"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "precios" ADD CONSTRAINT "precios_ruta_parada_destino_id_ruta_parada_id_fk" FOREIGN KEY ("ruta_parada_destino_id") REFERENCES "public"."ruta_parada"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ruta_parada" ADD CONSTRAINT "ruta_parada_ruta_id_rutas_id_fk" FOREIGN KEY ("ruta_id") REFERENCES "public"."rutas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ruta_parada" ADD CONSTRAINT "ruta_parada_parada_id_paradas_id_fk" FOREIGN KEY ("parada_id") REFERENCES "public"."paradas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rutas" ADD CONSTRAINT "rutas_parada_origen_id_paradas_id_fk" FOREIGN KEY ("parada_origen_id") REFERENCES "public"."paradas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rutas" ADD CONSTRAINT "rutas_parada_destino_id_paradas_id_fk" FOREIGN KEY ("parada_destino_id") REFERENCES "public"."paradas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rutas" ADD CONSTRAINT "rutas_resolucion_id_resoluciones_ant_id_fk" FOREIGN KEY ("resolucion_id") REFERENCES "public"."resoluciones_ant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rutas" ADD CONSTRAINT "rutas_cooperativa_id_cooperativa_transporte_id_fk" FOREIGN KEY ("cooperativa_id") REFERENCES "public"."cooperativa_transporte"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_cooperativa_id_cooperativa_transporte_id_fk" FOREIGN KEY ("cooperativa_id") REFERENCES "public"."cooperativa_transporte"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_oficinista_id_usuario_cooperativa_id_fk" FOREIGN KEY ("oficinista_id") REFERENCES "public"."usuario_cooperativa"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_precio_id_precios_id_fk" FOREIGN KEY ("precio_id") REFERENCES "public"."precios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_metodo_pago_id_metodos_pago_id_fk" FOREIGN KEY ("metodo_pago_id") REFERENCES "public"."metodos_pago"("id") ON DELETE no action ON UPDATE no action;