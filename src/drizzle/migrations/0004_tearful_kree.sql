CREATE UNIQUE INDEX "usuarios_email_unique" ON "usuarios" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "usuarios_cedula_unique" ON "usuarios" USING btree ("cedula");