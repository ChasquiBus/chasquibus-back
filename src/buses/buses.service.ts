import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { CreateBusDto } from './dto/create-bus.dto';
import { UpdateBusDto } from './dto/update-bus.dto';

import { eq, and } from 'drizzle-orm';
import { db } from 'drizzle/database';
import { buses } from 'drizzle/schema/bus';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class BusesService {
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

  async create(createBusDto: CreateBusDto, file?: Express.Multer.File) {
    // Validar placa única
    const busExistente = await db.select().from(buses)
      .where(
        and(
          eq(buses.placa, createBusDto.placa),
          eq(buses.cooperativa_id, createBusDto.cooperativa_id),
          eq(buses.activo, true)
        )
      );
    if (busExistente.length > 0) {
      throw new BadRequestException('Ya existe un bus con esa placa en la cooperativa.');
    }
    // Validar numero_bus único
    const busNumeroExistente = await db.select().from(buses)
      .where(
        and(
          eq(buses.numero_bus, createBusDto.numero_bus),
          eq(buses.cooperativa_id, createBusDto.cooperativa_id),
          eq(buses.activo, true)
        )
      );
    if (busNumeroExistente.length > 0) {
      throw new BadRequestException('Ya existe un bus con ese número en la cooperativa.');
    }
    // Validación de cantidad máxima de asientos
    if (createBusDto.piso_doble) {
      // Bus de dos pisos
      const totalPiso1 = createBusDto.total_asientos - (createBusDto.total_asientos_piso2 || 0);
      const totalPiso2 = createBusDto.total_asientos_piso2 || 0;
      const suma = totalPiso1 + totalPiso2;
      if (suma > 80) {
        throw new BadRequestException('La suma de asientos de ambos pisos no puede exceder 80 para un bus de dos pisos.');
      }
    } else {
      // Bus de un solo piso
      if (createBusDto.total_asientos > 50) {
        throw new BadRequestException('Un bus de un solo piso no puede tener más de 50 asientos.');
      }
    }
    let imagenUrl = null;
    if (file) {
      if (!file.mimetype.startsWith('image/')) {
        throw new BadRequestException('El archivo debe ser una imagen');
      }
      const fileExt = file.originalname.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `imagenes/buses/${fileName}`;
      const { data: uploadData, error: uploadError } = await this.supabase.storage
        .from('almacenamiento')
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false
        });
      if (uploadError) {
        throw new BadRequestException('Error al subir la imagen: ' + uploadError.message);
      }
      const { data: { publicUrl } } = this.supabase.storage
        .from('almacenamiento')
        .getPublicUrl(filePath);
      imagenUrl = publicUrl;
    }
    const busToInsert = { ...createBusDto, imagen: imagenUrl };
    if (!busToInsert.piso_doble) {
      busToInsert.total_asientos_piso2 = null; // Si no es doble piso, el segundo piso es nulo
    }
    return await db.insert(buses).values(busToInsert).returning();
  }

  async findAll(cooperativaId?: number) {
    if (cooperativaId) {
      return await db.select().from(buses).where(eq(buses.cooperativa_id, cooperativaId));
    }
    return await db.select().from(buses);
  }

  async findOne(id: number, cooperativaId?: number) {
    const conditions = [eq(buses.id, id)];
    if (cooperativaId) {
      conditions.push(eq(buses.cooperativa_id, cooperativaId));
    }
    const result = await db.select().from(buses).where(and(...conditions));
    return result[0] || null;
  }

  async update(id: number, updateBusDto: UpdateBusDto, cooperativaId?: number, file?: Express.Multer.File) {
    if (Object.keys(updateBusDto).length === 0 && !file) {
      throw new Error('No se proporcionaron valores para actualizar');
    }
    let imagenUrl = null;
    if (file) {
      if (!file.mimetype.startsWith('image/')) {
        throw new BadRequestException('El archivo debe ser una imagen');
      }
      // Obtener el bus actual para eliminar la imagen anterior si existe
      const conditions = [eq(buses.id, id)];
      if (cooperativaId) {
        conditions.push(eq(buses.cooperativa_id, cooperativaId));
      }
      const [busActual] = await db.select().from(buses).where(and(...conditions));
      if (busActual?.imagen) {
        const oldFilePath = busActual.imagen.split('/').pop();
        if (oldFilePath) {
          await this.supabase.storage
            .from('almacenamiento')
            .remove([`imagenes/buses/${oldFilePath}`]);
        }
      }
      const fileExt = file.originalname.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `imagenes/buses/${fileName}`;
      const { data: uploadData, error: uploadError } = await this.supabase.storage
        .from('almacenamiento')
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false
        });
      if (uploadError) {
        throw new BadRequestException('Error al subir la imagen: ' + uploadError.message);
      }
      const { data: { publicUrl } } = this.supabase.storage
        .from('almacenamiento')
        .getPublicUrl(filePath);
      imagenUrl = publicUrl;
    }
    const busToUpdate = { ...updateBusDto, imagen: imagenUrl };
    // Si se cambia a un solo piso, o si el campo piso_doble se envía como false
    if (busToUpdate.piso_doble === false || (busToUpdate.piso_doble === undefined && !busToUpdate.piso_doble)) {
      busToUpdate.total_asientos_piso2 = null;
    }
    // Si se cambia a doble piso y no se proporciona total_asientos_piso2, o si se intenta actualizar
    // y piso_doble es true pero no hay total_asientos_piso2, deberíamos manejarlo.
    // Aquí asumimos que el frontend enviará total_asientos_piso2 si piso_doble es true.

    const conditions = [eq(buses.id, id)];
    if (cooperativaId) {
      conditions.push(eq(buses.cooperativa_id, cooperativaId));
    }
    return await db.update(buses).set(busToUpdate).where(and(...conditions)).returning();
  }

  async remove(id: number, cooperativaId?: number) {
    const conditions = [eq(buses.id, id)];
    if (cooperativaId) {
      conditions.push(eq(buses.cooperativa_id, cooperativaId));
    }
    
    try {
      // Realizar un soft delete: actualizar deleted_at y activo a false
      const [deletedBus] = await db.update(buses)
        .set({ activo: false, deleted_at: new Date() })
        .where(and(...conditions))
        .returning();

      if (!deletedBus) {
        throw new NotFoundException('Bus no encontrado o no autorizado para eliminar.');
      }

      return deletedBus; // Retornar el bus que fue lógicamente eliminado
    } catch (error) {
      // Capturar cualquier otro error que ocurra durante la operación de la base de datos
      console.error("Error al realizar soft delete del bus:", error);
      // Incluir el mensaje del error original para facilitar el diagnóstico
      throw new InternalServerErrorException(`Error al eliminar el bus: ${error.message || error}.`);
    }
  }
}