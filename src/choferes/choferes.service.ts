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
import { cooperativaTransporte } from '../drizzle/schema/cooperativa-transporte';
import { UsuarioService } from 'usuarios/usuarios.service';
import { CooperativasService } from 'cooperativas/cooperativas.service';

@Injectable()
export class ChoferesService {
  private readonly rol = RolUsuario.CHOFER;
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly cooperativaService: CooperativasService
  ) {}

  async create(dto: CreateChoferDto) {
    const usuario = await this.usuarioService.createUser(dto, this.rol);

    const [chofer] = await db
      .insert(choferes)
      .values({
        usuarioId: usuario.id,
        numeroLicencia: dto.numeroLicencia ?? '',
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
    const results = await db
      .select({
        id: choferes.id,
        numeroLicencia: choferes.numeroLicencia,
        tipoLicencia: choferes.tipoLicencia,
        tipoSangre: choferes.tipoSangre,
        fechaNacimiento: choferes.fechaNacimiento,
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
      .leftJoin(cooperativaTransporte, eq(choferes.cooperativaTransporteId, cooperativaTransporte.id))
      .where(isNull(usuarios.deletedAt));

    return results.map((c) => ({
      id: c.id,
      numeroLicencia: c.numeroLicencia,
      tipoLicencia: c.tipoLicencia,
      tipoSangre: c.tipoSangre,
      fechaNacimiento: c.fechaNacimiento ? new Date(c.fechaNacimiento) : null,
      usuario: c.usuario,
      cooperativaTransporte: c.cooperativaTransporte ?? null,
    }));
  }

  async findOne(id: number): Promise<Chofer> {
    const [record] = await db
      .select({
        id: choferes.id,
        numeroLicencia: choferes.numeroLicencia,
        tipoLicencia: choferes.tipoLicencia,
        tipoSangre: choferes.tipoSangre,
        fechaNacimiento: choferes.fechaNacimiento,
        usuarioId: choferes.usuarioId,
        cooperativaTransporteId: choferes.cooperativaTransporteId,
      })
      .from(choferes)
      .where(eq(choferes.id, id))
      .limit(1);

    if (!record) {
      throw new NotFoundException(`Chofer con ID ${id} no encontrado.`);
    }

    const usuario = await this.usuarioService.findUserById(record.usuarioId);
    const cooperativa = record.cooperativaTransporteId
      ? await this.cooperativaService.findOne(record.cooperativaTransporteId)
      : null;

    return {
      id: record.id,
      numeroLicencia: record.numeroLicencia,
      tipoLicencia: record.tipoLicencia,
      tipoSangre: record.tipoSangre,
      fechaNacimiento: record.fechaNacimiento ? new Date(record.fechaNacimiento) : null,
      usuario,
      cooperativaTransporte: cooperativa,
    };
  }


  async update(id: number, dto: UpdateChoferDto) {
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

  async remove(id: number) {
    return this.usuarioService.deleteUser(id);
  }


  async findByUsuarioId(usuarioId: number): Promise<Chofer> {
  const [record] = await db
    .select({
      id: choferes.id,
      numeroLicencia: choferes.numeroLicencia,
      tipoLicencia: choferes.tipoLicencia,
      tipoSangre: choferes.tipoSangre,
      fechaNacimiento: choferes.fechaNacimiento,
      usuarioId: choferes.usuarioId,
      cooperativaTransporteId: choferes.cooperativaTransporteId,
    })
    .from(choferes)
    .where(eq(choferes.usuarioId, usuarioId))
    .limit(1);

  if (!record) {
    throw new NotFoundException(`Chofer con usuario ID ${usuarioId} no encontrado.`);
  }

  const usuario = await this.usuarioService.findUserById(usuarioId);
  const cooperativa = record.cooperativaTransporteId
    ? await this.cooperativaService.findOne(record.cooperativaTransporteId)
    : null;

  return {
    id: record.id,
    numeroLicencia: record.numeroLicencia,
    tipoLicencia: record.tipoLicencia,
    tipoSangre: record.tipoSangre,
    fechaNacimiento: record.fechaNacimiento ? new Date(record.fechaNacimiento) : null,
    usuario,
    cooperativaTransporte: cooperativa,
  };
}
}
