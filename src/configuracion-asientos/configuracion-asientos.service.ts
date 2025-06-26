import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateConfiguracionAsientosDto, TipoAsiento } from './dto/create-configuracion-asientos.dto';
import { UpdateConfiguracionAsientosDto } from './dto/update-configuracion-asientos.dto';
import { eq, and } from 'drizzle-orm';
import { db } from 'drizzle/database';
import { configuracionAsientos } from 'drizzle/schema/configuracion-asientos';
import { buses } from 'drizzle/schema/bus';

@Injectable()
export class ConfiguracionAsientosService {
  async create(dto: CreateConfiguracionAsientosDto) {
    // Verificar si el bus existe y obtener su configuración
    const bus = await db
      .select()
      .from(buses)
      .where(eq(buses.id, dto.busId))
      .then(rows => rows[0]);

    if (!bus) {
      throw new BadRequestException('El bus no existe');
    }

    const isDoubleDecker = bus.piso_doble;

    // Validar que el número total de asientos no exceda el límite
    if (isDoubleDecker) {
      // Para buses de dos pisos, mantenemos la validación contra el total del bus
      if (dto.posiciones.length > bus.total_asientos) {
        throw new BadRequestException(
          `El número total de asientos (${dto.posiciones.length}) excede el total definido para el bus de dos pisos (${bus.total_asientos})`,
        );
      }
    } else {
      // Para buses de un piso, el límite es 50
      if (dto.posiciones.length > 50) {
        throw new BadRequestException(
          `El número total de asientos (${dto.posiciones.length}) excede el límite de 50 para un bus de un solo piso.`,
        );
      }
    }

    // Validar que las posiciones de asientos coincidan con el tipo de bus
    const invalidPisoPositions = dto.posiciones.filter(pos => pos.piso > (isDoubleDecker ? 2 : 1));
    
    if (invalidPisoPositions.length > 0) {
      throw new BadRequestException(
        `Posiciones inválidas para un bus ${isDoubleDecker ? 'de dos pisos' : 'de un piso'}. ` +
        'Los números de piso deben ser 1' + (isDoubleDecker ? ' o 2' : '')
      );
    }

    // Validar que cada posición tenga todos los campos requeridos
    const missingFieldsPositions = dto.posiciones.filter(
      pos => !pos.fila || !pos.columna || !pos.piso || !pos.tipoAsiento || !pos.numeroAsiento
    );

    if (missingFieldsPositions.length > 0) {
      throw new BadRequestException(
        'Todas las posiciones deben tener fila, columna, piso, tipoAsiento y numeroAsiento'
      );
    }

    // Convertir las posiciones a JSON para almacenamiento
    const posicionesJson = JSON.stringify(dto.posiciones);

    // Crear la configuración de asientos
    return db.insert(configuracionAsientos).values({
      busId: dto.busId,
      posicionesJson,
    }).returning();
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

  async update(id: number, dto: UpdateConfiguracionAsientosDto) {
    // Si se están actualizando las posiciones, validar contra el tipo de bus
    if (dto.posiciones) {
      const config = await this.findOne(id);
      if (!config) {
        throw new BadRequestException('Configuración de asientos no encontrada');
      }

      const bus = await db
        .select()
        .from(buses)
        .where(eq(buses.id, config.busId))
        .then(rows => rows[0]);

      if (!bus) {
        throw new BadRequestException('El bus no existe');
      }

      const isDoubleDecker = bus.piso_doble;

      // Validar que el número total de asientos no exceda el límite
      if (isDoubleDecker) {
        // Para buses de dos pisos, mantenemos la validación contra el total del bus
        if (dto.posiciones.length > bus.total_asientos) {
          throw new BadRequestException(
            `El número total de asientos (${dto.posiciones.length}) excede el total definido para el bus de dos pisos (${bus.total_asientos})`,
          );
        }
      } else {
        // Para buses de un piso, el límite es 50
        if (dto.posiciones.length > 50) {
          throw new BadRequestException(
            `El número total de asientos (${dto.posiciones.length}) excede el límite de 50 para un bus de un solo piso.`,
          );
        }
      }

      const invalidPositions = dto.posiciones.filter(pos => pos.piso > (isDoubleDecker ? 2 : 1));
      
      if (invalidPositions.length > 0) {
        throw new BadRequestException(
          `Posiciones inválidas para un bus ${isDoubleDecker ? 'de dos pisos' : 'de un piso'}. ` +
          'Los números de piso deben ser 1' + (isDoubleDecker ? ' o 2' : '')
        );
      }

      // Validar que cada posición tenga todos los campos requeridos
      const missingFieldsPositions = dto.posiciones.filter(
        pos => !pos.fila || !pos.columna || !pos.piso || !pos.tipoAsiento || !pos.numeroAsiento
      );

      if (missingFieldsPositions.length > 0) {
        throw new BadRequestException(
          'Todas las posiciones deben tener fila, columna, piso, tipoAsiento y numeroAsiento'
        );
      }

      // Convertir las posiciones a JSON para almacenamiento
      dto.posicionesJson = JSON.stringify(dto.posiciones);
      delete dto.posiciones;
    }

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

  // Método adicional para obtener la configuración de asientos por bus
  async findByBusId(busId: number) {
    return db
      .select()
      .from(configuracionAsientos)
      .where(eq(configuracionAsientos.busId, busId));
  }
}
