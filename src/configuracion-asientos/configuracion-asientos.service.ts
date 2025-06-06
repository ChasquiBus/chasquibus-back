import { Injectable } from '@nestjs/common';
import { CreateConfiguracionAsientosDto } from './dto/create-configuracion-asientos.dto';
import { UpdateConfiguracionAsientosDto } from './dto/update-configuracion-asientos.dto';

import { eq } from 'drizzle-orm';
import { db } from 'drizzle/database';
import { configuracionAsientos } from 'drizzle/schema/configuracion-asientos';

@Injectable()
export class ConfiguracionAsientosService {
  create(dto: CreateConfiguracionAsientosDto) {
    return db.insert(configuracionAsientos).values(dto).returning();
  }

  findAll() {
    return db.select().from(configuracionAsientos);
  }

  findOne(id: number) {
    return db
      .select()
      .from(configuracionAsientos)
      .where(eq(configuracionAsientos.id, id))
      .then(rows => rows[0] || null);
  }

  update(id: number, dto: UpdateConfiguracionAsientosDto) {
    return db
      .update(configuracionAsientos)
      .set(dto)
      .where(eq(configuracionAsientos.id, id))
      .returning();
  }

  remove(id: number) {
    return db
      .delete(configuracionAsientos)
      .where(eq(configuracionAsientos.id, id));
  }
}
