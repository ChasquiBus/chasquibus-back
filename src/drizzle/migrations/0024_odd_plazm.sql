CREATE TABLE "boletos" (
	"id" serial PRIMARY KEY NOT NULL,
	"venta_id" integer,
	"hoja_trabajo" integer,
	"asiento_id" integer,
	"tarifa_id" integer,
	"descuento_id" integer,
	"codigo_qr" varchar(255),
	"cedula" varchar(20),
	"nombre" varchar(255),
	"total_sin_desc_por_pers" numeric(10, 2),
	"total_desc_por_pers" numeric(10, 2),
	"total_por_per" numeric(10, 2)
);
--> statement-breakpoint
ALTER TABLE "boletos" ADD CONSTRAINT "boletos_venta_id_ventas_id_fk" FOREIGN KEY ("venta_id") REFERENCES "public"."ventas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "boletos" ADD CONSTRAINT "boletos_hoja_trabajo_hoja_trabajo_id_fk" FOREIGN KEY ("hoja_trabajo") REFERENCES "public"."hoja_trabajo"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "boletos" ADD CONSTRAINT "boletos_asiento_id_configuracion_asientos_id_fk" FOREIGN KEY ("asiento_id") REFERENCES "public"."configuracion_asientos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "boletos" ADD CONSTRAINT "boletos_tarifa_id_tarifas_id_fk" FOREIGN KEY ("tarifa_id") REFERENCES "public"."tarifas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "boletos" ADD CONSTRAINT "boletos_descuento_id_descuentos_id_fk" FOREIGN KEY ("descuento_id") REFERENCES "public"."descuentos"("id") ON DELETE no action ON UPDATE no action;