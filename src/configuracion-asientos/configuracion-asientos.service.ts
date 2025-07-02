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

      // Solo valida los campos completos si el primer objeto tiene 'fila', 'columna', etc.
      if (
        dto.posiciones.length > 0 &&
        'fila' in dto.posiciones[0]
      ) {
        const isDoubleDecker = bus.piso_doble;
        const invalidPositions = dto.posiciones.filter(
          (pos: any) => pos.piso > (isDoubleDecker ? 2 : 1)
        );
        if (invalidPositions.length > 0) {
          throw new BadRequestException(
            `Posiciones inválidas para un bus ${isDoubleDecker ? 'de dos pisos' : 'de un piso'}. ` +
            'Los números de piso deben ser 1' + (isDoubleDecker ? ' o 2' : '')
          );
        }

        const missingFieldsPositions = dto.posiciones.filter(
          (pos: any) =>
            !pos.fila ||
            !pos.columna ||
            !pos.piso ||
            !pos.tipoAsiento ||
            !pos.numeroAsiento
        );
        if (missingFieldsPositions.length > 0) {
          throw new BadRequestException(
            'Todas las posiciones deben tener fila, columna, piso, tipoAsiento y numeroAsiento'
          );
        }
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

  async updateByBusId(busId: number, dto: UpdateConfiguracionAsientosDto) {
    const config = await db
      .select()
      .from(configuracionAsientos)
      .where(eq(configuracionAsientos.busId, busId))
      .then(rows => rows[0]);
  
    if (!config) {
      throw new BadRequestException('Configuración de asientos no encontrada para este bus');
    }

    // Si se reciben posiciones (asientos a actualizar), solo actualizar el campo 'ocupado' en el array completo
    if (dto.posiciones && Array.isArray(dto.posiciones) && dto.posiciones.length > 0) {
      // 1. Obtener el array completo de asientos
      let posicionesCompletas: any[] = [];
      try {
        posicionesCompletas = JSON.parse(config.posicionesJson);
      } catch (e) {
        throw new BadRequestException('Error al parsear las posiciones de asientos');
      }

      // 2. Para cada asiento recibido, buscarlo en el array completo y actualizar 'ocupado'
      for (const asientoActualizado of dto.posiciones) {
        const pos = posicionesCompletas.find(p => p.numeroAsiento === asientoActualizado.numeroAsiento);
        if (pos) {
          pos.ocupado = asientoActualizado.ocupado;
        }
      }

      // 3. Guardar el array completo actualizado
      const posicionesJson = JSON.stringify(posicionesCompletas);
      const [actualizado] = await db
        .update(configuracionAsientos)
        .set({ posicionesJson })
        .where(eq(configuracionAsientos.id, config.id))
        .returning();

      return actualizado;
    }
  
    // Si no se reciben posiciones, usar el update original
    return this.update(config.id, dto);
  }

  /**
   * Libera todos los asientos de un bus (pone ocupado: false en todos)
   */
  async liberarAsientosPorBusId(busId: number) {
    const config = await db
      .select()
      .from(configuracionAsientos)
      .where(eq(configuracionAsientos.busId, busId))
      .then(rows => rows[0]);

    if (!config) {
      throw new BadRequestException('Configuración de asientos no encontrada para este bus');
    }

    // Parsear posiciones
    let posiciones: any[] = [];
    try {
      posiciones = JSON.parse(config.posicionesJson);
    } catch (e) {
      throw new BadRequestException('Error al parsear las posiciones de asientos');
    }

    // Liberar todos los asientos
    posiciones = posiciones.map(pos => Object.assign({}, pos, { ocupado: false }));

    // Guardar en la base de datos
    const posicionesJson = JSON.stringify(posiciones);
    const [actualizado] = await db
      .update(configuracionAsientos)
      .set({ posicionesJson })
      .where(eq(configuracionAsientos.id, config.id))
      .returning();

    return actualizado;
  }
}
