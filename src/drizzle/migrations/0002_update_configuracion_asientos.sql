-- Drop old columns
ALTER TABLE configuracion_asientos DROP COLUMN IF EXISTS tipo_asiento;
ALTER TABLE configuracion_asientos DROP COLUMN IF EXISTS cantidad;
ALTER TABLE configuracion_asientos DROP COLUMN IF EXISTS precio_base;

-- Add foreign key constraint if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'configuracion_asientos_bus_id_fkey'
    ) THEN
        ALTER TABLE configuracion_asientos 
        ADD CONSTRAINT configuracion_asientos_bus_id_fkey 
        FOREIGN KEY (bus_id) REFERENCES buses(id);
    END IF;
END $$; 