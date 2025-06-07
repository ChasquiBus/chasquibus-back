import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { db } from '../drizzle/database';
import { usuarioCooperativa } from '../drizzle/schema/usuario-cooperativa';
import { CreateAdminDto } from './dto/create-admin.dto';
import { hash } from 'bcrypt';
import { and, eq, isNull } from 'drizzle-orm';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { usuarios } from '../drizzle/schema/usuarios';
import { UsuarioCooperativaEntity } from './entities/admin-cooperativa.entity';
import { UsuarioService } from 'usuarios/usuarios.service';

@Injectable()
export class AdminCooperativasService {
  constructor(private readonly usuarioService: UsuarioService) {}

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

  async findAll(rol:number): Promise<UsuarioCooperativaEntity[]> {
    return db
      .select({
        id: usuarioCooperativa.id,
        cooperativaTransporteId: usuarioCooperativa.cooperativaTransporteId,
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
          .where(
      and(
        isNull(usuarios.deletedAt),
        eq(usuarios.rol, rol)
      )
    );
  }

  async findOne(id: number): Promise<UsuarioCooperativaEntity> {
    const [record] = await db
      .select({
        id: usuarioCooperativa.id,
        cooperativaTransporteId: usuarioCooperativa.cooperativaTransporteId,
        usuarioId: usuarioCooperativa.usuarioId,
      })
      .from(usuarioCooperativa)
      .where(eq(usuarioCooperativa.id, id))
      .limit(1);

    if (!record) {
      throw new NotFoundException(`Administrador con ID ${id} no encontrado.`);
    }
    const usuario = await this.usuarioService.findUserById(record.usuarioId);
    return {
      id: record.id,
      cooperativaTransporteId: record.cooperativaTransporteId,
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
}
