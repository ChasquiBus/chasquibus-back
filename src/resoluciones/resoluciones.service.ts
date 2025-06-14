import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateResolucionDto } from './dto/create-resolucion.dto';
import { UpdateResolucionDto } from './dto/update-resolucion.dto';
import { createClient } from '@supabase/supabase-js';
import { db } from '../drizzle/database';
import { resolucionesAnt } from '../drizzle/schema/resoluciones-ant';
import { eq, and, isNull } from 'drizzle-orm';
import { format } from 'date-fns';

@Injectable()
export class ResolucionesService {
  private supabase;

  constructor() {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase credentials are not configured');
    }
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
    );
  }

  async create(
    createResolucionDto: CreateResolucionDto,
    file: Express.Multer.File,
  ) {
    const fechaActual = format(new Date(), 'yyyy-MM-dd');
    const path = `resoluciones/${createResolucionDto.cooperativaId}/${fechaActual}/${file.originalname}`;

    // Subir archivo a Supabase Storage
    const { data: uploadData, error: uploadError } = await this.supabase.storage
      .from('almacenamiento')
      .upload(path, file.buffer, {
        contentType: file.mimetype,
      });

    if (uploadError) {
      throw new HttpException(
        uploadError.message || 'Error al subir archivo a Supabase',
        Number(uploadError.statusCode) || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    // Obtener URL pública del archivo
    const {
      data: { publicUrl },
    } = this.supabase.storage.from('almacenamiento').getPublicUrl(path);

    // Crear registro en la base de datos
    const [resolucion] = await db
      .insert(resolucionesAnt)
      .values({
        documentoURL: publicUrl,
        fechaEmision: createResolucionDto.fechaEmision,
        fechaVencimiento: createResolucionDto.fechaVencimiento,
        estado: true, // Siempre se crea como activa
        cooperativaId: createResolucionDto.cooperativaId,
        enUso: false, // Siempre se crea como no en uso
      })
      .returning();

    return resolucion;
  }

  async findAll(cooperativaId: number) {
    if (!cooperativaId) {
      throw new Error(
        'Se requiere el ID de la cooperativa para listar las resoluciones',
      );
    }

    return await db
      .select()
      .from(resolucionesAnt)
      .where(
        and(
          eq(resolucionesAnt.cooperativaId, cooperativaId),
          eq(resolucionesAnt.estado, true),
        ),
      );
  }

  async findOne(id: number) {
    const [resolucion] = await db
      .select()
      .from(resolucionesAnt)
      .where(and(eq(resolucionesAnt.id, id), eq(resolucionesAnt.estado, true)));
    return resolucion;
  }

  async update(
    id: number,
    updateResolucionDto: UpdateResolucionDto,
    file?: Express.Multer.File,
  ) {
    let documentoURL = updateResolucionDto.documentoURL;

    if (file) {
      const fechaActual = format(new Date(), 'yyyy-MM-dd');
      const path = `resoluciones/${updateResolucionDto.cooperativaId}/${fechaActual}/${file.originalname}`;

      // Subir nuevo archivo
      const { data: uploadData, error: uploadError } =
        await this.supabase.storage
          .from('almacenamiento')
          .upload(path, file.buffer, {
            contentType: file.mimetype,
          });

      if (uploadError) throw uploadError;

      // Obtener nueva URL pública
      const {
        data: { publicUrl },
      } = this.supabase.storage.from('almacenamiento').getPublicUrl(path);

      documentoURL = publicUrl;
    }

    const [resolucion] = await db
      .update(resolucionesAnt)
      .set({
        documentoURL,
        fechaEmision: updateResolucionDto.fechaEmision,
        fechaVencimiento: updateResolucionDto.fechaVencimiento,
        estado: updateResolucionDto.estado,
        cooperativaId: updateResolucionDto.cooperativaId,
        enUso: updateResolucionDto.enUso,
        updatedAt: new Date(),
      })
      .where(and(eq(resolucionesAnt.id, id), eq(resolucionesAnt.estado, true)))
      .returning();

    return resolucion;
  }

  async remove(id: number) {
    const [resolucion] = await db
      .select()
      .from(resolucionesAnt)
      .where(and(eq(resolucionesAnt.id, id), eq(resolucionesAnt.estado, true)));

    if (resolucion) {
      // Eliminar archivo de Supabase Storage
      const path = resolucion.documentoURL?.split('/').pop();
      if (path) {
        await this.supabase.storage
          .from('almacenamiento')
          .remove([`resoluciones/${resolucion.cooperativaId}/${path}`]);
      }

      // Soft delete en la base de datos
      await db
        .update(resolucionesAnt)
        .set({
          estado: false,
          deletedAt: new Date(),
        })
        .where(eq(resolucionesAnt.id, id));
    }

    return { message: 'Resolución eliminada correctamente' };
  }
}
