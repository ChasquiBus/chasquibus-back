import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { boletos } from '../drizzle/schema/boletos';
import { eq } from 'drizzle-orm';
import { CreateBoletoDto } from './dto/create-boleto.dto';
import { UpdateBoletoDto } from './dto/update-boleto.dto';
import { Boleto } from './entities/boleto.entity';
import type { Database } from '../drizzle/database';

@Injectable()
export class BoletosService {
  constructor(@Inject(DRIZZLE) private readonly db: Database) {}

  async create(createBoletoDto: CreateBoletoDto): Promise<Boleto> {
    const [newBoleto] = await this.db
      .insert(boletos)
      .values(createBoletoDto)
      .returning();

    return newBoleto;
  }

  async findAll(): Promise<Boleto[]> {
    return await this.db.select().from(boletos);
  }

  async findOne(id: number): Promise<Boleto> {
    const [boleto] = await this.db
      .select()
      .from(boletos)
      .where(eq(boletos.id, id));

    if (!boleto) {
      throw new NotFoundException(`Boleto con ID ${id} no encontrado`);
    }

    return boleto;
  }

  async update(id: number, updateBoletoDto: UpdateBoletoDto): Promise<Boleto> {
    const [updatedBoleto] = await this.db
      .update(boletos)
      .set(updateBoletoDto)
      .where(eq(boletos.id, id))
      .returning();

    if (!updatedBoleto) {
      throw new NotFoundException(`Boleto con ID ${id} no encontrado`);
    }

    return updatedBoleto;
  }

  async remove(id: number): Promise<void> {
    const [deletedBoleto] = await this.db
      .delete(boletos)
      .where(eq(boletos.id, id))
      .returning();

    if (!deletedBoleto) {
      throw new NotFoundException(`Boleto con ID ${id} no encontrado`);
    }
  }

  async findByVentaId(ventaId: number): Promise<Boleto[]> {
    return await this.db
      .select()
      .from(boletos)
      .where(eq(boletos.ventaId, ventaId));
  }



  async findByCedula(cedula: string): Promise<Boleto[]> {
    return await this.db
      .select()
      .from(boletos)
      .where(eq(boletos.cedula, cedula));
  }
} 