import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { db } from '../drizzle/database';
import { usuarioCooperativa } from '../drizzle/schema/usuario-cooperativa';
import { cooperativaTransporte } from '../drizzle/schema/cooperativa-transporte';
import { CreateAdminDto } from './dto/create-admin.dto';
import { hash } from 'bcrypt';
import { and, eq, isNull } from 'drizzle-orm';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { usuarios } from '../drizzle/schema/usuarios';
import { UsuarioCooperativaEntity } from './entities/admin-cooperativa.entity';
import { UsuarioService } from 'usuarios/usuarios.service';
import { CooperativasService } from 'cooperativas/cooperativas.service';

@Injectable()
export class AdminCooperativasService {
  constructor(private readonly usuarioService: UsuarioService,
    private readonly cooperativaService: CooperativasService,
  )
   {}

  //Pasamos el rol 1 o 2
  async create(dto: CreateAdminDto, rol: number) {
    if (![1, 2].includes(rol)) {
      throw new BadRequestException(
        'Rol inválido. Solo se permiten los roles 1 o 2.',
      );
    }
    const usuario = await this.usuarioService.createUser(dto, rol);
    await db.insert(usuarioCooperativa).values({
      cooperativaTransporteId: dto.cooperativaTransporteId,
      usuarioId: usuario.id,
    });
    return {
      cooperativaTransporteId: dto.cooperativaTransporteId,
      usuario,
    };
  }

  async findAll(rol: number): Promise<UsuarioCooperativaEntity[]> {
    return db
      .select({
        id: usuarioCooperativa.id,

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
      .from(usuarioCooperativa)
      .innerJoin(usuarios, eq(usuarioCooperativa.usuarioId, usuarios.id))
      // Agregamos el inner join con la tabla de cooperativas
      .innerJoin(
        cooperativaTransporte,
        eq(usuarioCooperativa.cooperativaTransporteId, cooperativaTransporte.id),
      )
      .where(and(isNull(usuarios.deletedAt), eq(usuarios.rol, rol)));
  }


 async findOne(id: number): Promise<UsuarioCooperativaEntity> {
    const [record] = await db
      .select({
        id: usuarioCooperativa.id,
        cooperativaTransporteId: usuarioCooperativa.cooperativaTransporteId, // Necesitamos el ID para buscar la cooperativa
        usuarioId: usuarioCooperativa.usuarioId,
      })
      .from(usuarioCooperativa)
      .where(eq(usuarioCooperativa.id, id))
      .limit(1);

    if (!record) {
      throw new NotFoundException(`Administrador con ID ${id} no encontrado.`);
    }

    // Obtenemos el usuario completo
    const usuario = await this.usuarioService.findUserById(record.usuarioId);
    // Obtenemos la cooperativa completa usando el servicio de cooperativas
    const cooperativa = await this.cooperativaService.findOne(record.cooperativaTransporteId);

    if (!cooperativa) {
      // Maneja el caso si la cooperativa no se encuentra (opcional, dependiendo de tu lógica de negocio)
      // Por ejemplo, podrías lanzar un error o retornar null para 'cooperativaTransporte'
      console.warn(`Cooperativa con ID ${record.cooperativaTransporteId} no encontrada para el registro ${record.id}`);
    }

    return {
      id: record.id,
      cooperativaTransporte: cooperativa, // Asignamos el objeto cooperativa completo
      usuario,
    };
  }

  //--
  async update(id: number, dto: UpdateAdminDto) {
    const existingUser = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.id, id))
      .limit(1);

    if (existingUser.length === 0) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
    }

    const updateData: Partial<typeof usuarios.$inferInsert> = {};

    if (dto.nombre !== undefined) updateData.nombre = dto.nombre;
    if (dto.apellido !== undefined) updateData.apellido = dto.apellido;
    if (dto.cedula !== undefined) updateData.cedula = dto.cedula;
    if (dto.telefono !== undefined) updateData.telefono = dto.telefono;
    if (dto.email !== undefined) updateData.email = dto.email;
    if (dto.activo !== undefined) updateData.activo = dto.activo;

    if (dto.password !== undefined && dto.password.length > 0) {
      updateData.passwordHash = await hash(dto.password, 10);
    }

    updateData.updatedAt = new Date();
    // -------------------------------------------------------------------------

    if (
      Object.keys(updateData).length === 0 &&
      dto.cooperativaTransporteId === undefined
    ) {
      // Si la única actualización era updatedAt, y no había otros datos,
      // esto aún lanzaría un error. Podrías ajustar esta lógica si quieres
      // permitir un "toque" sin datos, pero generalmente no es el caso de uso.
      throw new BadRequestException(
        'No se proporcionaron datos para actualizar.',
      );
    }

    const [updatedUser] = await db
      .update(usuarios)
      .set(updateData)
      .where(eq(usuarios.id, id))
      .returning();

    if (dto.cooperativaTransporteId !== undefined) {
      await db
        .insert(usuarioCooperativa)
        .values({
          usuarioId: id,
          cooperativaTransporteId: dto.cooperativaTransporteId,
        })
        .onConflictDoUpdate({
          target: usuarioCooperativa.usuarioId,
          set: { cooperativaTransporteId: dto.cooperativaTransporteId },
        });
    }

    return updatedUser;
  }

  async remove(id: number) {
    return this.usuarioService.deleteUser(id);
  }

  async findByUsuarioId(usuarioId: number): Promise<UsuarioCooperativaEntity> {
  const [record] = await db
    .select({
      id: usuarioCooperativa.id,
      cooperativaTransporteId: usuarioCooperativa.cooperativaTransporteId,
      usuarioId: usuarioCooperativa.usuarioId,
    })
    .from(usuarioCooperativa)
    .where(eq(usuarioCooperativa.usuarioId, usuarioId))
    .limit(1);

  if (!record) {
    throw new NotFoundException(`Usuario-cooperativa con usuario ID ${usuarioId} no encontrado.`);
  }

  const usuario = await this.usuarioService.findUserById(usuarioId);
  const cooperativa = await this.cooperativaService.findOne(record.cooperativaTransporteId);

  return {
    id: record.id,
    cooperativaTransporte: cooperativa,
    usuario,
  };
}

}
