import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create.usuario';
import { UsuarioEntity } from './entities/usuario.entity';
import { usuarios as usuariosSchema } from '../drizzle/schema/usuarios';
import { eq } from 'drizzle-orm';
import { db } from '../drizzle/database';
import { hash } from 'bcrypt';
import { UpdateUsuarioDto } from './dto/update.usuario';

@Injectable()
export class UsuarioService {
  constructor() {}

  async createUser(
    createUserDto: CreateUserDto,
    rol: number,
  ): Promise<Omit<UsuarioEntity, 'password' | 'passwordHash'>> {
    const existingUserByEmail = await db
      .select()
      .from(usuariosSchema)
      .where(eq(usuariosSchema.email, createUserDto.email))
      .limit(1);

    if (existingUserByEmail.length > 0) {
      throw new ConflictException('El correo electrónico ya está registrado.');
    }

    const existingUserByCedula = await db
      .select()
      .from(usuariosSchema)
      .where(eq(usuariosSchema.cedula, createUserDto.cedula))
      .limit(1);

    if (existingUserByCedula.length > 0) {
      throw new ConflictException('La cédula ya está registrada.');
    }

    const passwordHash = await hash(createUserDto.password, 10);
    const newUser = {
      email: createUserDto.email,
      passwordHash,
      nombre: createUserDto.nombre,
      apellido: createUserDto.apellido,
      cedula: createUserDto.cedula,
      telefono: createUserDto.telefono || null,
      activo: createUserDto.activo ?? true,
      rol: rol,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    const [createdUser] = await db
      .insert(usuariosSchema)
      .values(newUser)
      .returning();

    if (!createdUser) {
      throw new ConflictException('No se pudo crear el usuario.');
    }
    const usuarioEntity: Omit<UsuarioEntity, 'password' | 'passwordHash'> = {
      id: createdUser.id,
      email: createdUser.email,
      nombre: createdUser.nombre,
      apellido: createdUser.apellido,
      cedula: createdUser.cedula,
      telefono: createdUser.telefono,
      activo: createdUser.activo,
      rol: createdUser.rol,
      createdAt: createdUser.createdAt,
      updatedAt: createdUser.updatedAt,
      deletedAt: createdUser.deletedAt,
    };

    return usuarioEntity;
  }

  async findAll(
    includeInactive: boolean = false,
  ): Promise<Omit<UsuarioEntity, 'password' | 'passwordHash'>[]> {
    const baseQuery = db
      .select({
        id: usuariosSchema.id,
        email: usuariosSchema.email,
        nombre: usuariosSchema.nombre,
        apellido: usuariosSchema.apellido,
        cedula: usuariosSchema.cedula,
        telefono: usuariosSchema.telefono,
        activo: usuariosSchema.activo,
        rol: usuariosSchema.rol,
        createdAt: usuariosSchema.createdAt,
        updatedAt: usuariosSchema.updatedAt,
        deletedAt: usuariosSchema.deletedAt,
      })
      .from(usuariosSchema);

    let users;
    if (!includeInactive) {
      users = await baseQuery.where(eq(usuariosSchema.activo, true));
    } else {
      users = await baseQuery; // If includeInactive is true, execute the base query without a where clause
    }
    return users;
  }

  async findUserById(
    id: number,
  ): Promise<Omit<UsuarioEntity, 'password' | 'passwordHash'>> {
    const [user] = await db
      .select()
      .from(usuariosSchema)
      .where(eq(usuariosSchema.id, id))
      .limit(1);

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
    }

    return {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      apellido: user.apellido,
      cedula: user.cedula,
      telefono: user.telefono,
      activo: user.activo,
      rol: user.rol,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    };
  }

  async deleteUser(
    id: number,
  ): Promise<Omit<UsuarioEntity, 'password' | 'passwordHash'>> {
    const existingUser = await this.findUserById(id);
    if (!existingUser) {
      throw new NotFoundException(
        `Usuario con ID ${id} no encontrado para eliminar.`,
      );
    }

    const [updatedUser] = await db
      .update(usuariosSchema)
      .set({
        activo: false,
        deletedAt: new Date(),
        updatedAt: new Date(), // También se actualiza la fecha de modificación
      })
      .where(eq(usuariosSchema.id, id))
      .returning();

    if (!updatedUser) {
      throw new ConflictException(
        `No se pudo realizar la eliminación suave para el usuario con ID ${id}.`,
      );
    }

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      nombre: updatedUser.nombre,
      apellido: updatedUser.apellido,
      cedula: updatedUser.cedula,
      telefono: updatedUser.telefono,
      activo: updatedUser.activo,
      rol: updatedUser.rol,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
      deletedAt: updatedUser.deletedAt,
    };
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUsuarioDto,
  ): Promise<Omit<UsuarioEntity, 'password' | 'passwordHash'>> {
    const [existingUser] = await db
      .select()
      .from(usuariosSchema)
      .where(eq(usuariosSchema.id, id))
      .limit(1);

    if (!existingUser) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
    }

    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const emailExists = await db
        .select()
        .from(usuariosSchema)
        .where(eq(usuariosSchema.email, updateUserDto.email))
        .limit(1);

      if (emailExists.length > 0) {
        throw new ConflictException(
          'El correo electrónico ya está registrado.',
        );
      }
    }

    // Validación para cédula duplicada si se actualiza
    if (updateUserDto.cedula && updateUserDto.cedula !== existingUser.cedula) {
      const cedulaExists = await db
        .select()
        .from(usuariosSchema)
        .where(eq(usuariosSchema.cedula, updateUserDto.cedula))
        .limit(1);

      if (cedulaExists.length > 0) {
        throw new ConflictException('La cédula ya está registrada.');
      }
    }

    // Preparar datos para actualización
    const updatedFields: any = {
      ...updateUserDto,
      updatedAt: new Date(),
    };

    // Si se está actualizando la contraseña, hashearla
    if (updateUserDto.password) {
      updatedFields.passwordHash = await hash(updateUserDto.password, 10);
      delete updatedFields.password; // No se almacena texto plano
    }

    const [updatedUser] = await db
      .update(usuariosSchema)
      .set(updatedFields)
      .where(eq(usuariosSchema.id, id))
      .returning();

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      nombre: updatedUser.nombre,
      apellido: updatedUser.apellido,
      cedula: updatedUser.cedula,
      telefono: updatedUser.telefono,
      activo: updatedUser.activo,
      rol: updatedUser.rol,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
      deletedAt: updatedUser.deletedAt,
    };
  }
}
