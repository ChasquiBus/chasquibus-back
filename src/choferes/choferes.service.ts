import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { db } from '../drizzle/database';
import { usuarios } from '../drizzle/schema/usuarios';
import { choferes } from '../drizzle/schema/choferes';
import type { InferSelectModel } from 'drizzle-orm';
import { RolUsuario } from '../auth/roles.enum';
import { hash } from 'bcrypt';
import { eq, and, isNull } from 'drizzle-orm';
import { CreateChoferDto } from './dto/create-chofer.dto';
import { UpdateChoferDto } from './dto/update-chofer.dto';
import { cooperativaTransporte } from '../drizzle/schema/cooperativa-transporte';
import { UsuarioService } from 'usuarios/usuarios.service';
import { CooperativasService } from 'cooperativas/cooperativas.service';
import { usuarioCooperativa } from '../drizzle/schema/usuario-cooperativa';
import { AdminCooperativasService } from 'admin-cooperativas/admin-cooperativas.service';

@Injectable()
export class ChoferesService {
  private readonly rol = RolUsuario.CHOFER;
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly cooperativaService: CooperativasService,
    private readonly usuarioCooperativaService: AdminCooperativasService
  ) {}

  async create(createChoferDto: CreateChoferDto, user: any) {
    const { cooperativaTransporteId } = await this.validateUserAccess(user);

    if (createChoferDto.cooperativaTransporteId !== cooperativaTransporteId) {
      throw new ForbiddenException('No puedes crear choferes para otra cooperativa.');
    }

    const [existingUser] = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.email, createChoferDto.email))
      .limit(1);

    if (existingUser) {
      throw new Error('El email ya está registrado.');
    }

    const passwordHash = await hash(createChoferDto.password, 10);

    const [newUser] = await db
      .insert(usuarios)
      .values({
        nombre: createChoferDto.nombre,
        apellido: createChoferDto.apellido,
        cedula: createChoferDto.cedula,
        telefono: createChoferDto.telefono,
        email: createChoferDto.email,
        passwordHash,
        rol: RolUsuario.CHOFER,
        activo: true,
      })
      .returning();

    if (!createChoferDto.numeroLicencia || !createChoferDto.tipoLicencia) {
      throw new Error('El número de licencia y el tipo de licencia son obligatorios.');
    }

    const choferData = {
      usuarioId: newUser.id,
      numeroLicencia: createChoferDto.numeroLicencia,
      tipoLicencia: createChoferDto.tipoLicencia,
      tipoSangre: createChoferDto.tipoSangre || null,
      fechaNacimiento: createChoferDto.fechaNacimiento || null,
      cooperativaTransporteId: createChoferDto.cooperativaTransporteId,
    };

    const [newChofer] = await db
      .insert(choferes)
      .values(choferData)
      .returning();

    return newChofer;
  }

  async findAll(cooperativaId: number, includeDeleted: boolean = false): Promise<InferSelectModel<typeof choferes>[]> {
    const baseQuery = db
      .select({
        id: choferes.id,
        usuarioId: choferes.usuarioId,
        numeroLicencia: choferes.numeroLicencia,
        tipoLicencia: choferes.tipoLicencia,
        tipoSangre: choferes.tipoSangre,
        fechaNacimiento: choferes.fechaNacimiento,
        cooperativaTransporteId: choferes.cooperativaTransporteId,
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
        cooperativaTransporte: {
          id: cooperativaTransporte.id,
          nombre: cooperativaTransporte.nombre,
          ruc: cooperativaTransporte.ruc,
          logo: cooperativaTransporte.logo,
          colorPrimario: cooperativaTransporte.colorPrimario,
          colorSecundario: cooperativaTransporte.colorSecundario,
          sitioWeb: cooperativaTransporte.sitioWeb,
          email: cooperativaTransporte.email,
          telefono: cooperativaTransporte.telefono,
          direccion: cooperativaTransporte.direccion,
          activo: cooperativaTransporte.activo,
          createdAt: cooperativaTransporte.createdAt,
          updatedAt: cooperativaTransporte.updatedAt,
          deletedAt: cooperativaTransporte.deletedAt,
        },
      })
      .from(choferes)
      .innerJoin(usuarios, eq(choferes.usuarioId, usuarios.id))
      .innerJoin(
        cooperativaTransporte,
        eq(choferes.cooperativaTransporteId, cooperativaTransporte.id),
      )
      .where(
        and(
          eq(choferes.cooperativaTransporteId, cooperativaId),
          ...(includeDeleted ? [] : [
            eq(usuarios.activo, true),
            isNull(usuarios.deletedAt)
          ])
        )
      );

    return baseQuery;
  }

  async findOne(id: number, user: any) {
    const { cooperativaTransporteId } = await this.validateUserAccess(user);

    const [chofer] = await db
      .select({
        id: choferes.id,
        usuarioId: choferes.usuarioId,
        numeroLicencia: choferes.numeroLicencia,
        tipoLicencia: choferes.tipoLicencia,
        tipoSangre: choferes.tipoSangre,
        fechaNacimiento: choferes.fechaNacimiento,
        cooperativaTransporteId: choferes.cooperativaTransporteId,
        usuario: {
          id: usuarios.id,
          nombre: usuarios.nombre,
          apellido: usuarios.apellido,
          cedula: usuarios.cedula,
          telefono: usuarios.telefono,
          email: usuarios.email,
          rol: usuarios.rol,
          activo: usuarios.activo,
        },
      })
      .from(choferes)
      .innerJoin(usuarios, eq(choferes.usuarioId, usuarios.id))
      .where(
        and(
          eq(choferes.id, id),
          eq(choferes.cooperativaTransporteId, cooperativaTransporteId),
        ),
      )
      .limit(1);

    if (!chofer) {
      throw new NotFoundException(`Chofer con ID ${id} no encontrado.`);
    }

    return chofer;
  }

  async update(id: number, updateChoferDto: UpdateChoferDto, user: any) {
    const { cooperativaTransporteId } = await this.validateUserAccess(user);

    const [existingChofer] = await db
      .select()
      .from(choferes)
      .where(
        and(
          eq(choferes.id, id),
          eq(choferes.cooperativaTransporteId, cooperativaTransporteId),
        ),
      )
      .limit(1);

    if (!existingChofer) {
      throw new NotFoundException(`Chofer con ID ${id} no encontrado.`);
    }

    const updateData: Partial<typeof choferes.$inferInsert> = {};

    if (updateChoferDto.numeroLicencia !== undefined) {
      updateData.numeroLicencia = updateChoferDto.numeroLicencia;
    }
    if (updateChoferDto.tipoLicencia !== undefined) {
      updateData.tipoLicencia = updateChoferDto.tipoLicencia;
    }
    if (updateChoferDto.tipoSangre !== undefined) {
      updateData.tipoSangre = updateChoferDto.tipoSangre;
    }
    if (updateChoferDto.fechaNacimiento !== undefined) {
      updateData.fechaNacimiento = updateChoferDto.fechaNacimiento;
    }

    if (Object.keys(updateData).length === 0) {
      throw new Error('No se proporcionaron datos para actualizar.');
    }

    const [updatedChofer] = await db
      .update(choferes)
      .set(updateData)
      .where(eq(choferes.id, id))
      .returning();

    return updatedChofer;
  }

  async remove(id: number, user: any) {
    const { cooperativaTransporteId } = await this.validateUserAccess(user);

    const [existingChofer] = await db
      .select()
      .from(choferes)
      .where(
        and(
          eq(choferes.id, id),
          eq(choferes.cooperativaTransporteId, cooperativaTransporteId),
        ),
      )
      .limit(1);

    if (!existingChofer) {
      throw new NotFoundException(`Chofer con ID ${id} no encontrado.`);
    }

    await db
      .update(usuarios)
      .set({
        activo: false,
      })
      .where(eq(usuarios.id, existingChofer.usuarioId));

    return existingChofer;
  }

  async findByUsuarioId(usuarioId: number, user?: any) {
    const [chofer] = await db
      .select({
        id: choferes.id,
        usuarioId: choferes.usuarioId,
        numeroLicencia: choferes.numeroLicencia,
        tipoLicencia: choferes.tipoLicencia,
        tipoSangre: choferes.tipoSangre,
        fechaNacimiento: choferes.fechaNacimiento,
        cooperativaTransporte: cooperativaTransporte,
      })
      .from(choferes)
      .innerJoin(cooperativaTransporte, eq(choferes.cooperativaTransporteId, cooperativaTransporte.id))
      .where(eq(choferes.usuarioId, usuarioId))
      .limit(1);

    if (!chofer) {
      throw new NotFoundException(`Chofer con usuario ID ${usuarioId} no encontrado.`);
    }

    // Si el usuario es ADMIN u OFICINISTA, verificar que pertenezca a la misma cooperativa
    if (user && (user.rol === RolUsuario.ADMIN || user.rol === RolUsuario.OFICINISTA)) {
      const usuarioCoop = await this.usuarioCooperativaService.findByUsuarioId(user.sub);
      if (!usuarioCoop.cooperativaTransporte) {
        throw new ForbiddenException('No tienes una cooperativa asignada.');
      }
      if (usuarioCoop.cooperativaTransporte.id !== chofer.cooperativaTransporte.id) {
        throw new ForbiddenException('No tienes permiso para acceder a este chofer.');
      }
    }

    return chofer;
  }

  private async validateUserAccess(user: any) {
    if (![RolUsuario.ADMIN, RolUsuario.OFICINISTA].includes(user.rol)) {
      throw new ForbiddenException(
        'No tienes permiso para acceder a este recurso.',
      );
    }

    const [userCoop] = await db
      .select()
      .from(usuarioCooperativa)
      .where(eq(usuarioCooperativa.usuarioId, user.id))
      .limit(1);

    if (!userCoop) {
      throw new ForbiddenException(
        'No tienes una cooperativa asignada.',
      );
    }

    return { cooperativaTransporteId: userCoop.cooperativaTransporteId };
  }
}
