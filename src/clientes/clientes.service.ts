import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { db } from '../drizzle/database';
import { usuarios } from '../drizzle/schema/usuarios';
import { clientes } from '../drizzle/schema/clientes';
import { RolUsuario } from '../auth/roles.enum';
import { hash } from 'bcrypt';
import { eq, and, isNull } from 'drizzle-orm';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { ClienteEntity } from './entities/cliente.entity';

@Injectable()
export class ClientesService {
  async create(dto: CreateClienteDto) {
    const passwordHash = await hash(dto.password, 10);

    const [usuario] = await db
      .insert(usuarios)
      .values({
        nombre: dto.nombre,
        apellido: dto.apellido,
        cedula: dto.cedula,
        telefono: dto.telefono,
        email: dto.email,
        passwordHash,
        rol: RolUsuario.CLIENTE,
      })
      .returning();

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

  return clientesResult.map(cliente => ({
    ...cliente,
    fechaNacimiento: cliente.fechaNacimiento ? new Date(cliente.fechaNacimiento) : null, // Convertir string a Date
  }));
}

 async findOne(id: number): Promise<ClienteEntity> {
  const [result] = await db
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
    .where(and(eq(clientes.id, id), isNull(usuarios.deletedAt)))
    .limit(1);

  if (!result) {
    throw new NotFoundException(`Cliente con ID ${id} no encontrado.`);
  }

  return {
    ...result,
    fechaNacimiento: result.fechaNacimiento ? new Date(result.fechaNacimiento) : null, // Convertir string a Date
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
      throw new BadRequestException('No se proporcionaron datos para actualizar.');
    }

    const [updatedUsuario] = await db
      .update(usuarios)
      .set(updateUsuarioData)
      .where(eq(usuarios.id, usuarioId))
      .returning();

    const clienteUpdateData: Partial<typeof clientes.$inferInsert> = {};
    if (dto.esDiscapacitado !== undefined) clienteUpdateData.esDiscapacitado = dto.esDiscapacitado;
    if (dto.porcentajeDiscapacidad !== undefined) clienteUpdateData.porcentajeDiscapacidad = dto.porcentajeDiscapacidad;
    if (dto.fechaNacimiento !== undefined) clienteUpdateData.fechaNacimiento = dto.fechaNacimiento;

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
    const [cliente] = await db
      .select()
      .from(clientes)
      .where(eq(clientes.id, id))
      .limit(1);

    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado.`);
    }

    return db
      .update(usuarios)
      .set({
        activo: false,
        deletedAt: new Date(),
      })
      .where(eq(usuarios.id, cliente.usuarioId))
      .returning();
  }
}
