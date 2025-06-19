// rutas.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateRutaDto } from './dto/create-ruta.dto';
import { db } from '../drizzle/database';
import { rutas } from '../drizzle/schema/rutas';
import { paradas } from '../drizzle/schema/paradas';
import { eq, and } from 'drizzle-orm';
import { createClient } from '@supabase/supabase-js';
import { format } from 'date-fns';
import { generarCodigoRuta } from 'paradas/paradas.service';

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
  const { paradaOrigenId, paradaDestinoId } = createRutaDto;

  const [origen] = await db.select().from(paradas).where(
    and(eq(paradas.id, paradaOrigenId), eq(paradas.esTerminal, true))
  );
  const [destino] = await db.select().from(paradas).where(
    and(eq(paradas.id, paradaDestinoId), eq(paradas.esTerminal, true))
  );

  if (!origen || !destino) {
    throw new BadRequestException('Las paradas de origen y destino deben ser terminales');
  }

  const codigo = await generarCodigoRuta(paradaOrigenId, paradaDestinoId);

  if (!file || file.mimetype !== 'application/pdf') {
    throw new BadRequestException('Debes enviar un PDF válido');
  }

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

  const [ruta] = await db.insert(rutas).values({
    ...createRutaDto,
    cooperativaId,
    resolucionUrl: publicUrl,
    estado: createRutaDto.estado ?? true,
    codigo, 
  }).returning();

  return ruta;
}

// Obtener todas las rutas activas de una cooperativa
async getAll(cooperativaId: number) {
  return await db.select().from(rutas)
    .where(and(
      eq(rutas.cooperativaId, cooperativaId),
      eq(rutas.estado, true)
    ));
}

// Obtener una ruta específica de una cooperativa
async getOne(cooperativaId: number, id: number) {
  const [ruta] = await db.select().from(rutas)
    .where(and(
      eq(rutas.id, id),
      eq(rutas.cooperativaId, cooperativaId),
      eq(rutas.estado, true)
    ));
  if (!ruta) {
    throw new BadRequestException('Ruta no encontrada o no pertenece a tu cooperativa');
  }
  return ruta;
}

// Eliminar lógicamente una ruta (cambiar estado y deletedAt)
async delete(cooperativaId: number, id: number) {
  const [ruta] = await db.select().from(rutas)
    .where(and(
      eq(rutas.id, id),
      eq(rutas.cooperativaId, cooperativaId),
      eq(rutas.estado, true)
    ));
  if (!ruta) {
    throw new BadRequestException('Ruta no encontrada o no pertenece a tu cooperativa');
  }
  const deletedAt = new Date();
  await db.update(rutas)
    .set({ estado: false, deletedAt })
    .where(eq(rutas.id, id));
  return { message: 'Ruta eliminada correctamente' };
}

// Actualizar una ruta existente
async update(cooperativaId: number, id: number, updateRutaDto: Partial<CreateRutaDto>, file?: Express.Multer.File) {
  // Buscar la ruta existente y validar que pertenezca a la cooperativa
  const [rutaExistente] = await db.select().from(rutas)
    .where(and(
      eq(rutas.id, id),
      eq(rutas.cooperativaId, cooperativaId),
      eq(rutas.estado, true)
    ));
  if (!rutaExistente) {
    throw new BadRequestException('Ruta no encontrada o no pertenece a tu cooperativa');
  }

  // Validar paradas si se actualizan
  let codigo = rutaExistente.codigo;
  if (updateRutaDto.paradaOrigenId && updateRutaDto.paradaDestinoId) {
    const [origen] = await db.select().from(paradas).where(
      and(eq(paradas.id, updateRutaDto.paradaOrigenId), eq(paradas.esTerminal, true))
    );
    const [destino] = await db.select().from(paradas).where(
      and(eq(paradas.id, updateRutaDto.paradaDestinoId), eq(paradas.esTerminal, true))
    );
    if (!origen || !destino) {
      throw new BadRequestException('Las paradas de origen y destino deben ser terminales');
    }
    codigo = await generarCodigoRuta(updateRutaDto.paradaOrigenId, updateRutaDto.paradaDestinoId);
  }

  // Manejar el archivo PDF si se envía uno nuevo
  let resolucionUrl = rutaExistente.resolucionUrl;
  if (file) {
    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('Debes enviar un PDF válido');
    }
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
    resolucionUrl = publicUrl;
  }

  // Actualizar la ruta
  const [ruta] = await db.update(rutas)
    .set({
      ...updateRutaDto,
      codigo,
      resolucionUrl,
      updatedAt: new Date(),
    })
    .where(eq(rutas.id, id))
    .returning();

  return ruta;
}

}
