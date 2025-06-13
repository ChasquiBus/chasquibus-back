import { Injectable } from '@nestjs/common';
import { CreateBusDto } from './dto/create-bus.dto';
import { UpdateBusDto } from './dto/update-bus.dto';

import { eq, and } from 'drizzle-orm';
import { db } from 'drizzle/database';
import { buses } from 'drizzle/schema/bus';

@Injectable()
export class BusesService {
  async create(createBusDto: CreateBusDto) {
    return await db.insert(buses).values(createBusDto).returning();
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

  async update(id: number, updateBusDto: UpdateBusDto, cooperativaId?: number) {
    const conditions = [eq(buses.id, id)];
    if (cooperativaId) {
      conditions.push(eq(buses.cooperativa_id, cooperativaId));
    }
    return await db.update(buses).set(updateBusDto).where(and(...conditions)).returning();
  }

  async remove(id: number, cooperativaId?: number) {
    const conditions = [eq(buses.id, id)];
    if (cooperativaId) {
      conditions.push(eq(buses.cooperativa_id, cooperativaId));
    }
    return await db.delete(buses).where(and(...conditions)).returning();
  }
}
