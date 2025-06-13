import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { db } from '../drizzle/database';
import { usuarios } from '../drizzle/schema/usuarios';
import { clientes } from '../drizzle/schema/clientes';
import { RolUsuario } from '../auth/roles.enum';
import { hash } from 'bcrypt';
import { eq, and, isNull } from 'drizzle-orm';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { ClienteEntity } from './entities/cliente.entity';
import { UsuarioService } from 'usuarios/usuarios.service';

@Injectable()
export class ClientesService {
  private readonly rol = RolUsuario.CLIENTE;
  constructor(private readonly usuarioService: UsuarioService) {}
  async create(dto: CreateClienteDto) {

    const usuario = await this.usuarioService.createUser(dto, this.rol);
    const [cliente] = await db
      .insert(clientes)
      .values({
        usuarioId: usuario.id,
        esDiscapacitado: dto.esDiscapacitado,
        porcentajeDiscapacidad: dto.porcentajeDiscapacidad,
        fechaNacimiento: dto.fechaNacimiento,
      })
      .returning();

    return {
      ...cliente,
      usuario,
    };
  }

  async findAll(): Promise<ClienteEntity[]> {
    const clientesResult = await db
      .select({
        id: clientes.id,
        esDiscapacitado: clientes.esDiscapacitado,
        porcentajeDiscapacidad: clientes.porcentajeDiscapacidad,
        fechaNacimiento: clientes.fechaNacimiento,
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
      .from(clientes)
      .innerJoin(usuarios, eq(clientes.usuarioId, usuarios.id))
      .where(isNull(usuarios.deletedAt));

    return clientesResult.map((cliente) => ({
      ...cliente,
      fechaNacimiento: cliente.fechaNacimiento
        ? new Date(cliente.fechaNacimiento)
        : null, // Convertir string a Date
    }));
  }

  async findOne(id: number): Promise<ClienteEntity> {
    const [cliente] = await db
      .select()
      .from(clientes)
      .where(eq(clientes.id, id))
      .limit(1);

    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado.`);
    }

    const usuario = await this.usuarioService.findUserById(cliente.usuarioId);

    return {
      id: cliente.id,
      esDiscapacitado: cliente.esDiscapacitado,
      porcentajeDiscapacidad: cliente.porcentajeDiscapacidad,
      fechaNacimiento: cliente.fechaNacimiento
        ? new Date(cliente.fechaNacimiento)
        : null,
      usuario,
    };
  }

  async update(id: number, dto: UpdateClienteDto) {
    const [cliente] = await db
      .select()
      .from(clientes)
      .where(eq(clientes.id, id))
      .limit(1);

    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado.`);
    }

    const usuarioId = cliente.usuarioId;

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

    updateUsuarioData.updatedAt = new Date();

    if (
      Object.keys(updateUsuarioData).length === 0 &&
      dto.esDiscapacitado === undefined &&
      dto.porcentajeDiscapacidad === undefined &&
      dto.fechaNacimiento === undefined
    ) {
      throw new BadRequestException(
        'No se proporcionaron datos para actualizar.',
      );
    }

    const [updatedUsuario] = await db
      .update(usuarios)
      .set(updateUsuarioData)
      .where(eq(usuarios.id, usuarioId))
      .returning();

    const clienteUpdateData: Partial<typeof clientes.$inferInsert> = {};
    if (dto.esDiscapacitado !== undefined)
      clienteUpdateData.esDiscapacitado = dto.esDiscapacitado;
    if (dto.porcentajeDiscapacidad !== undefined)
      clienteUpdateData.porcentajeDiscapacidad = dto.porcentajeDiscapacidad;
    if (dto.fechaNacimiento !== undefined)
      clienteUpdateData.fechaNacimiento = dto.fechaNacimiento;

    if (Object.keys(clienteUpdateData).length > 0) {
      await db
        .update(clientes)
        .set(clienteUpdateData)
        .where(eq(clientes.id, id));
    }

    return {
      id,
      ...clienteUpdateData,
      usuario: updatedUsuario,
    };
  }

  async remove(id: number) {
    return this.usuarioService.deleteUser(id);
  }

  async findByUsuarioId(usuarioId: number): Promise<ClienteEntity> {
  const [cliente] = await db
    .select()
    .from(clientes)
    .where(eq(clientes.usuarioId, usuarioId))
    .limit(1);

  if (!cliente) {
    throw new NotFoundException(`Cliente con usuario ID ${usuarioId} no encontrado.`);
  }

  const usuario = await this.usuarioService.findUserById(usuarioId);

  return {
    id: cliente.id,
    esDiscapacitado: cliente.esDiscapacitado,
    porcentajeDiscapacidad: cliente.porcentajeDiscapacidad,
    fechaNacimiento: cliente.fechaNacimiento
      ? new Date(cliente.fechaNacimiento)
      : null,
    usuario,
  };
}

  async updateProfile(usuarioId: number, dto: UpdateClienteDto) {
    const [cliente] = await db
      .select()
      .from(clientes)
      .where(eq(clientes.usuarioId, usuarioId))
      .limit(1);

    if (!cliente) {
      throw new NotFoundException(`Cliente no encontrado.`);
    }

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

    updateUsuarioData.updatedAt = new Date();

    if (
      Object.keys(updateUsuarioData).length === 0 &&
      dto.esDiscapacitado === undefined &&
      dto.porcentajeDiscapacidad === undefined &&
      dto.fechaNacimiento === undefined
    ) {
      throw new BadRequestException(
        'No se proporcionaron datos para actualizar.',
      );
    }

    const [updatedUsuario] = await db
      .update(usuarios)
      .set(updateUsuarioData)
      .where(eq(usuarios.id, usuarioId))
      .returning();

    const clienteUpdateData: Partial<typeof clientes.$inferInsert> = {};
    if (dto.esDiscapacitado !== undefined)
      clienteUpdateData.esDiscapacitado = dto.esDiscapacitado;
    if (dto.porcentajeDiscapacidad !== undefined)
      clienteUpdateData.porcentajeDiscapacidad = dto.porcentajeDiscapacidad;
    if (dto.fechaNacimiento !== undefined)
      clienteUpdateData.fechaNacimiento = dto.fechaNacimiento;

    if (Object.keys(clienteUpdateData).length > 0) {
      await db
        .update(clientes)
        .set(clienteUpdateData)
        .where(eq(clientes.id, cliente.id));
    }

    return {
      id: cliente.id,
      ...clienteUpdateData,
      usuario: updatedUsuario,
    };
  }

  async deleteAccount(usuarioId: number) {
    const [cliente] = await db
      .select()
      .from(clientes)
      .where(eq(clientes.usuarioId, usuarioId))
      .limit(1);

    if (!cliente) {
      throw new NotFoundException(`Cliente no encontrado.`);
    }

    // Marcar como eliminado en lugar de eliminar físicamente
    const [deletedUsuario] = await db
      .update(usuarios)
      .set({
        activo: false,
        deletedAt: new Date(),
      })
      .where(eq(usuarios.id, usuarioId))
      .returning();

    return {
      id: cliente.id,
      usuario: deletedUsuario,
    };
  }
}
