import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { db } from '../drizzle/database';
import { cooperativaTransporte } from '../drizzle/schema/cooperativa-transporte';
import { eq, and, isNull } from 'drizzle-orm';
import { CreateCooperativaDto } from './dto/create-cooperativa.dto';
import { UpdateCooperativaDto } from './dto/update-cooperativa.dto';
import { Cooperativa } from './entities/cooperativa.entity';
import { usuarioCooperativa } from '../drizzle/schema/usuario-cooperativa';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class CooperativasService {
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

  async create(data: CreateCooperativaDto, file?: Express.Multer.File): Promise<Cooperativa[]> {
    const now = new Date();
    let logoUrl = null;

    if (file) {
      // Validar el tipo de archivo
      if (!file.mimetype.startsWith('image/')) {
        throw new BadRequestException('El archivo debe ser una imagen');
      }

      // Generar un nombre único para el archivo
      const fileExt = file.originalname.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `imagenes/logos/${fileName}`;

      // Subir el archivo a Supabase
      const { data: uploadData, error: uploadError } = await this.supabase.storage
        .from('almacenamiento')
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false
        });

      if (uploadError) {
        throw new BadRequestException('Error al subir la imagen: ' + uploadError.message);
      }

      // Obtener la URL pública del archivo
      const { data: { publicUrl } } = this.supabase.storage
        .from('almacenamiento')
        .getPublicUrl(filePath);

      logoUrl = publicUrl;
    }

    return db
      .insert(cooperativaTransporte)
      .values({
        ...data,
        logo: logoUrl,
        activo: true,
        createdAt: now,
        updatedAt: now,
      })
      .returning();
  }

  async findAll(isSuperAdmin: boolean = false): Promise<Cooperativa[]> {
    if (isSuperAdmin) {
      return db
        .select()
        .from(cooperativaTransporte);
    } else {
      return db
        .select()
        .from(cooperativaTransporte)
        .where(
          and(
            eq(cooperativaTransporte.activo, true),
            isNull(cooperativaTransporte.deletedAt),
          ),
        );
    }
  }

  async findOne(id: number): Promise<Cooperativa | null> {
    const [cooperativa] = await db
      .select()
      .from(cooperativaTransporte)
      .where(
        and(
          eq(cooperativaTransporte.id, id),
          eq(cooperativaTransporte.activo, true),
          isNull(cooperativaTransporte.deletedAt),
        ),
      );
    return cooperativa || null;
  }

  async update(id: number, data: UpdateCooperativaDto, adminCooperativaId?: number, file?: Express.Multer.File): Promise<Cooperativa[]> {
    // Si es un admin, verificamos que esté intentando modificar su propia cooperativa
    if (adminCooperativaId !== undefined) {
      const [adminCooperativa] = await db
        .select()
        .from(usuarioCooperativa)
        .where(eq(usuarioCooperativa.usuarioId, adminCooperativaId))
        .limit(1);

      if (!adminCooperativa) {
        throw new NotFoundException('No se encontró la cooperativa asociada al administrador.');
      }

      if (adminCooperativa.cooperativaTransporteId !== id) {
        throw new ForbiddenException('No tienes permiso para modificar esta cooperativa.');
      }
    }

    let logoUrl = data.logo;

    if (file) {
      // Validar el tipo de archivo
      if (!file.mimetype.startsWith('image/')) {
        throw new BadRequestException('El archivo debe ser una imagen');
      }

      // Obtener la cooperativa actual para eliminar la imagen anterior si existe
      const [cooperativaActual] = await db
        .select()
        .from(cooperativaTransporte)
        .where(eq(cooperativaTransporte.id, id));

      if (cooperativaActual?.logo) {
        // Extraer el nombre del archivo de la URL actual
        const oldFilePath = cooperativaActual.logo.split('/').pop();
        if (oldFilePath) {
          // Eliminar la imagen anterior
          await this.supabase.storage
            .from('almacenamiento')
            .remove([`imagenes/logos/${oldFilePath}`]);
        }
      }

      // Generar un nombre único para el archivo
      const fileExt = file.originalname.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `imagenes/logos/${fileName}`;

      // Subir el archivo a Supabase
      const { data: uploadData, error: uploadError } = await this.supabase.storage
        .from('almacenamiento')
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false
        });

      if (uploadError) {
        throw new BadRequestException('Error al subir la imagen: ' + uploadError.message);
      }

      // Obtener la URL pública del archivo
      const { data: { publicUrl } } = this.supabase.storage
        .from('almacenamiento')
        .getPublicUrl(filePath);

      logoUrl = publicUrl;
    }

    return db
      .update(cooperativaTransporte)
      .set({
        ...data,
        logo: logoUrl,
        updatedAt: new Date(),
      })
      .where(eq(cooperativaTransporte.id, id))
      .returning();
  }

  async remove(id: number): Promise<Cooperativa[]> {
    return db
      .update(cooperativaTransporte)
      .set({ activo: false, deletedAt: new Date() })
      .where(eq(cooperativaTransporte.id, id))
      .returning();
  }
}