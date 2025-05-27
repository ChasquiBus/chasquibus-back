import { Injectable } from '@nestjs/common';
import { CreateBusDto } from './dto/create-bus.dto';
import { UpdateBusDto } from './dto/update-bus.dto';

import { eq } from 'drizzle-orm';
import { db } from 'drizzle/database';
import { buses } from 'drizzle/schema/bus';

@Injectable()
export class BusesService {
  async create(createBusDto: CreateBusDto) {
    return await db.insert(buses).values(createBusDto).returning();
  }

  async findAll() {
    return await db.select().from(buses);
  }

  async findOne(id: number) {
    const result = await db.select().from(buses).where(eq(buses.id, id));
    return result[0] || null;
  }

  async update(id: number, updateBusDto: UpdateBusDto) {
    return await db.update(buses).set(updateBusDto).where(eq(buses.id, id)).returning();
  }

  async remove(id: number) {
    return await db.delete(buses).where(eq(buses.id, id)).returning();
  }
}
