import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTarifasParadaDto } from './dto/create-tarifas-parada.dto';
import { UpdateTarifasParadaDto } from './dto/update-tarifas-parada.dto';
import { db } from '../drizzle/database';
import { tarifas } from '../drizzle/schema/tarifas';
import { rutas } from '../drizzle/schema/rutas';
import { eq, desc, and } from 'drizzle-orm';

@Injectable()
export class TarifasParadasService {
  async create(createTarifasParadaDto: CreateTarifasParadaDto) {
    const [newTarifa] = await db
      .insert(tarifas)
      .values({
        rutaId: createTarifasParadaDto.rutaId,
        paradaOrigenId: createTarifasParadaDto.paradaOrigenId,
        paradaDestinoId: createTarifasParadaDto.paradaDestinoId,
        tipoAsiento: createTarifasParadaDto.tipoAsiento,
        valor: createTarifasParadaDto.valor.toString(),
        aplicaTarifa: createTarifasParadaDto.aplicaTarifa ?? true,
      })
      .returning();

    return newTarifa;
  }

  async findAll(cooperativaId: number) {
    return await db
      .select({
        id: tarifas.id,
        rutaId: tarifas.rutaId,
        paradaOrigenId: tarifas.paradaOrigenId,
        paradaDestinoId: tarifas.paradaDestinoId,
        tipoAsiento: tarifas.tipoAsiento,
        valor: tarifas.valor,
        aplicaTarifa: tarifas.aplicaTarifa,
      })
      .from(tarifas)
      .innerJoin(rutas, eq(tarifas.rutaId, rutas.id))
      .where(eq(rutas.cooperativaId, cooperativaId));
  }

  async findMejoresTarifas(cooperativaId: number) {
    return await db
      .select({
        id: tarifas.id,
        rutaId: tarifas.rutaId,
        paradaOrigenId: tarifas.paradaOrigenId,
        paradaDestinoId: tarifas.paradaDestinoId,
        tipoAsiento: tarifas.tipoAsiento,
        valor: tarifas.valor,
        aplicaTarifa: tarifas.aplicaTarifa,
      })
      .from(tarifas)
      .innerJoin(rutas, eq(tarifas.rutaId, rutas.id))
      .where(eq(rutas.cooperativaId, cooperativaId))
      .orderBy(desc(tarifas.valor));
  }

  async findByRutaId(rutaId: number) {
    const tarifasRuta = await db
      .select()
      .from(tarifas)
      .where(eq(tarifas.rutaId, rutaId));

    if (tarifasRuta.length === 0) {
      throw new NotFoundException(`No se encontraron tarifas para la ruta con ID ${rutaId}`);
    }

    return tarifasRuta;
  }

  async findOne(id: number) {
    const [tarifa] = await db
      .select()
      .from(tarifas)
      .where(eq(tarifas.id, id));

    if (!tarifa) {
      throw new NotFoundException(`Tarifa con ID ${id} no encontrada`);
    }

    return tarifa;
  }

  async update(id: number, updateTarifasParadaDto: UpdateTarifasParadaDto) {
    // Verificar que la tarifa existe
    await this.findOne(id);

    const updateData: any = {};
    
    if (updateTarifasParadaDto.tipoAsiento !== undefined) {
      updateData.tipoAsiento = updateTarifasParadaDto.tipoAsiento;
    }
    
    if (updateTarifasParadaDto.valor !== undefined) {
      updateData.valor = updateTarifasParadaDto.valor.toString();
    }
    
    if (updateTarifasParadaDto.aplicaTarifa !== undefined) {
      updateData.aplicaTarifa = updateTarifasParadaDto.aplicaTarifa;
    }

    const [updatedTarifa] = await db
      .update(tarifas)
      .set(updateData)
      .where(eq(tarifas.id, id))
      .returning();

    return updatedTarifa;
  }

  async remove(id: number) {
    // Verificar que la tarifa existe
    await this.findOne(id);

    const [deletedTarifa] = await db
      .delete(tarifas)
      .where(eq(tarifas.id, id))
      .returning();

    return deletedTarifa;
  }
}
