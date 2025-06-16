import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateTarifasParadaDto } from './dto/create-tarifas-parada.dto';
import { UpdateTarifasParadaDto } from './dto/update-tarifas-parada.dto';
import { db } from '../drizzle/database';
import { precios } from '../drizzle/schema/precios';
import { eq, and } from 'drizzle-orm';

@Injectable()
export class TarifasParadasService {
  async create(createTarifasParadaDto: CreateTarifasParadaDto) {
    // Verificar si ya existe una tarifa para estas paradas
    const [existingTarifa] = await db
      .select()
      .from(precios)
      .where(
        and(
          eq(precios.ParadaOrigenId, createTarifasParadaDto.ParadaOrigenId),
          eq(precios.ParadaDestinoId, createTarifasParadaDto.ParadaDestinoId)
        )
      );

    if (existingTarifa) {
      throw new BadRequestException('Ya existe una tarifa para estas paradas');
    }

    const [nuevaTarifa] = await db
      .insert(precios)
      .values({
        ...createTarifasParadaDto,
        costo: createTarifasParadaDto.costo?.toString()
      })
      .returning();

    return nuevaTarifa;
  }

  async findAll() {
    const tarifas = await db
      .select()
      .from(precios);

    return tarifas;
  }

  async findOne(id: number) {
    const [tarifa] = await db
      .select()
      .from(precios)
      .where(eq(precios.id, id));

    if (!tarifa) {
      throw new NotFoundException(`Tarifa con ID ${id} no encontrada`);
    }

    return tarifa;
  }

  async update(id: number, updateTarifasParadaDto: UpdateTarifasParadaDto) {
    const [tarifa] = await db
      .select()
      .from(precios)
      .where(eq(precios.id, id));

    if (!tarifa) {
      throw new NotFoundException(`Tarifa con ID ${id} no encontrada`);
    }

    const [tarifaActualizada] = await db
      .update(precios)
      .set({
        ...updateTarifasParadaDto,
        costo: updateTarifasParadaDto.costo?.toString()
      })
      .where(eq(precios.id, id))
      .returning();

    return tarifaActualizada;
  }

  async remove(id: number) {
    const [tarifa] = await db
      .select()
      .from(precios)
      .where(eq(precios.id, id));

    if (!tarifa) {
      throw new NotFoundException(`Tarifa con ID ${id} no encontrada`);
    }

    await db
      .delete(precios)
      .where(eq(precios.id, id));

    return { message: 'Tarifa eliminada exitosamente' };
  }
}
