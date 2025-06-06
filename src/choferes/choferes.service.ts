import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { db } from '../drizzle/database';
import { usuarios } from '../drizzle/schema/usuarios';
import { choferes } from '../drizzle/schema/choferes';
import { RolUsuario } from '../auth/roles.enum';
import { hash } from 'bcrypt';
import { eq, and, isNull } from 'drizzle-orm';
import { CreateChoferDto } from './dto/create-chofer.dto';
import { UpdateChoferDto } from './dto/update-chofer.dto';
import { Chofer } from './entities/chofer.entity';

@Injectable()
export class ChoferesService {
  async create(dto: CreateChoferDto) {
    const passwordHash = await hash(dto.password, 10);

    // 1. Insertar en tabla usuarios con rol de chofer (3)
    const [usuario] = await db
      .insert(usuarios)
      .values({
        nombre: dto.nombre,
        apellido: dto.apellido,
        cedula: dto.cedula,
        telefono: dto.telefono,
        email: dto.email,
        passwordHash,
        rol: RolUsuario.CHOFER, // asumiendo que RolUsuario.CHOFER === 3
      })
      .returning();

    // 2. Insertar en tabla choferes con los datos específicos
    const [chofer] = await db
      .insert(choferes)
      .values({
        usuarioId: usuario.id, // <-- Aquí está el fix
        numeroLicencia: dto.numeroLicencia?? '',
        tipoLicencia: dto.tipoLicencia ?? '',
        tipoSangre: dto.tipoSangre ?? null,
        fechaNacimiento: dto.fechaNacimiento
          ? new Date(dto.fechaNacimiento).toISOString().split('T')[0]
          : null,
          cooperativaTransporteId: dto.cooperativaTransporteId,
      })
      .returning();

    return {
      ...chofer,
      usuario,
    };
  }

  async findAll(): Promise<Chofer[]> {
    const choferesResult = await db
      .select({
        id: choferes.id,
        numeroLicencia: choferes.numeroLicencia,
        tipoLicencia: choferes.tipoLicencia,
        tipoSangre: choferes.tipoSangre,
        fechaNacimiento: choferes.fechaNacimiento,
        cooperativaTransporteId: choferes.id,
        usuario: {
          id: usuarios.id,
          email: usuarios.email,
          nombre: usuarios.nombre,
          apellido: usuarios.apellido,
          cedula: usuarios.cedula,
          telefono: usuarios.telefono,
          activo: usuarios.activo,
          rol: usuarios.rol,
          createdAt: usuarios.createdAt,
          updatedAt: usuarios.updatedAt,
          deletedAt: usuarios.deletedAt,
        },
      })
      .from(choferes)
      .innerJoin(usuarios, eq(choferes.usuarioId, usuarios.id))
      .where(isNull(usuarios.deletedAt));

    return choferesResult.map((c) => ({
      ...c,
      fechaNacimiento: c.fechaNacimiento ? new Date(c.fechaNacimiento) : null,
    }));
  }

  async findOne(id: number): Promise<Chofer> {
    const [result] = await db
      .select({
        id: choferes.id,
        numeroLicencia: choferes.numeroLicencia,
        tipoLicencia: choferes.tipoLicencia,
        tipoSangre: choferes.tipoSangre,
        fechaNacimiento: choferes.fechaNacimiento,
        cooperativaTransporteId: choferes.id,
        usuario: {
          id: usuarios.id,
          email: usuarios.email,
          nombre: usuarios.nombre,
          apellido: usuarios.apellido,
          cedula: usuarios.cedula,
          telefono: usuarios.telefono,
          activo: usuarios.activo,
          rol: usuarios.rol,
          createdAt: usuarios.createdAt,
          updatedAt: usuarios.updatedAt,
          deletedAt: usuarios.deletedAt,
        },
      })
      .from(choferes)
      .innerJoin(usuarios, eq(choferes.usuarioId, usuarios.id))
      .where(and(eq(choferes.id, id), isNull(usuarios.deletedAt)))
      .limit(1);

    if (!result) {
      throw new NotFoundException(`Chofer con ID ${id} no encontrado.`);
    }

    return {
      ...result,
      fechaNacimiento: result.fechaNacimiento
        ? new Date(result.fechaNacimiento)
        : null,
    };
  }

  async update(id: number, dto: UpdateChoferDto) {
    // 1. Verificar existencia del chofer
    const [chofer] = await db
      .select()
      .from(choferes)
      .where(eq(choferes.id, id))
      .limit(1);

    if (!chofer) {
      throw new NotFoundException(`Chofer con ID ${id} no encontrado.`);
    }

    const usuarioId = chofer.usuarioId;

    // 2. Preparar datos para actualizar usuario
    const updateUsuarioData: Partial<typeof usuarios.$inferInsert> = {};
    if (dto.nombre !== undefined) updateUsuarioData.nombre = dto.nombre;
    if (dto.apellido !== undefined) updateUsuarioData.apellido = dto.apellido;
    if (dto.cedula !== undefined) updateUsuarioData.cedula = dto.cedula;
    if (dto.telefono !== undefined) updateUsuarioData.telefono = dto.telefono;
    if (dto.email !== undefined) updateUsuarioData.email = dto.email;
    if (dto.activo !== undefined) updateUsuarioData.activo = dto.activo;

    if (dto.password !== undefined && dto.password.length > 0) {
      updateUsuarioData.passwordHash = await hash(dto.password, 10);
    }

    if (Object.keys(updateUsuarioData).length > 0) {
      updateUsuarioData.updatedAt = new Date();
    }

    // 3. Preparar datos para actualizar chofer
    const choferUpdateData: Partial<typeof choferes.$inferInsert> = {};
    if (dto.numeroLicencia !== undefined)
      choferUpdateData.numeroLicencia = dto.numeroLicencia;
    if (dto.tipoLicencia !== undefined)
      choferUpdateData.tipoLicencia = dto.tipoLicencia;
    if (dto.tipoSangre !== undefined)
      choferUpdateData.tipoSangre = dto.tipoSangre;
    if (dto.fechaNacimiento !== undefined) {
      choferUpdateData.fechaNacimiento = dto.fechaNacimiento; // es string
    }
    if (
      Object.keys(updateUsuarioData).length === 0 &&
      Object.keys(choferUpdateData).length === 0
    ) {
      throw new BadRequestException(
        'No se proporcionaron datos para actualizar.',
      );
    }

    // 4. Ejecutar actualización en tabla usuarios (si aplica)
    let updatedUsuario: typeof usuarios.$inferSelect | null = null;
    if (Object.keys(updateUsuarioData).length > 0) {
      const [usuario] = await db
        .update(usuarios)
        .set(updateUsuarioData)
        .where(eq(usuarios.id, usuarioId))
        .returning();
      updatedUsuario = usuario;
    }

    // 5. Ejecutar actualización en tabla choferes (si aplica)
    if (Object.keys(choferUpdateData).length > 0) {
      await db
        .update(choferes)
        .set(choferUpdateData)
        .where(eq(choferes.id, id));
    }

    return {
      id,
      ...choferUpdateData,
      usuario:
        updatedUsuario ??
        (
          await db
            .select()
            .from(usuarios)
            .where(eq(usuarios.id, usuarioId))
            .limit(1)
        )[0],
    };
  }

  /**
   * Elimina lógicamente un chofer dado su ID:
   * - Marca el usuario asociado como inactivo y le asigna deletedAt.
   */
  async remove(id: number) {
    // 1. Verificar existencia del chofer
    const [chofer] = await db
      .select()
      .from(choferes)
      .where(eq(choferes.id, id))
      .limit(1);

    if (!chofer) {
      throw new NotFoundException(`Chofer con ID ${id} no encontrado.`);
    }

    // 2. Marcar usuario como inactivo y establecer deletedAt
    const result = await db
      .update(usuarios)
      .set({
        activo: false,
        deletedAt: new Date(),
      })
      .where(eq(usuarios.id, chofer.usuarioId))
      .returning();

    return result;
  }
}
