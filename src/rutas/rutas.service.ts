// rutas.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateRutaDto } from './dto/create-ruta.dto';
import { db } from '../drizzle/database';
import { rutas } from '../drizzle/schema/rutas';
import { paradas } from '../drizzle/schema/paradas';
import { eq, and } from 'drizzle-orm';
import { createClient } from '@supabase/supabase-js';
import { format } from 'date-fns';

@Injectable()
export class RutasService {
  private supabase;

  constructor() {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase credentials are not configuradas');
    }
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
    );
  }

  async create(cooperativaId: number, createRutaDto: CreateRutaDto, file: Express.Multer.File) {
    // 1. Validaciones de paradas
    const [origen] = await db.select().from(paradas).where(
      and(eq(paradas.id, createRutaDto.paradaOrigenId), eq(paradas.esTerminal, true))
    );
    const [destino] = await db.select().from(paradas).where(
      and(eq(paradas.id, createRutaDto.paradaDestinoId), eq(paradas.esTerminal, true))
    );
    if (!origen || !destino) {
      throw new BadRequestException('Las paradas de origen y destino deben ser terminales');
    }

    // 2. Validación de PDF
    if (!file || file.mimetype !== 'application/pdf' || !file.buffer || file.buffer.length === 0) {
      throw new BadRequestException('Debes enviar un PDF válido');
    }

    // 3. Subida a Supabase
    const fecha = format(new Date(), 'yyyy-MM-dd');
    const filename = `${cooperativaId}-${fecha}-${file.originalname}`;
    const path = `rutas/${filename}`;
    const { error: uploadError } = await this.supabase
      .storage.from('almacenamiento')
      .upload(path, file.buffer, { contentType: 'application/pdf' });
    if (uploadError) {
      throw new BadRequestException(`Error al subir PDF: ${uploadError.message}`);
    }
    const { data: { publicUrl } } = this.supabase
      .storage.from('almacenamiento')
      .getPublicUrl(path);

    // 4. Crear ruta en DB
    const [ruta] = await db.insert(rutas).values({
      ...createRutaDto,
      cooperativaId,
      resolucionUrl: publicUrl,
      estado: createRutaDto.estado ?? true,
    }).returning();

    return ruta;
  }

}
