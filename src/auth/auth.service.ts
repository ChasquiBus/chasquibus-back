import {

  Injectable,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { eq } from 'drizzle-orm';
import { Database } from 'drizzle/database';
import { usuarios } from 'drizzle/schema/usuarios';
import { AdminCooperativasService } from 'admin-cooperativas/admin-cooperativas.service';
import { ChoferesService } from 'choferes/choferes.service';
import { ClientesService } from 'clientes/clientes.service';
import { RolUsuario } from '../auth/roles.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(DRIZZLE) private readonly db: Database, 
    private readonly usuarioCooperativaService: AdminCooperativasService,
    private readonly choferService: ChoferesService,
    private readonly clienteService: ClientesService,
  ) {}

   async login(dto: LoginDto) {
    const user = await this.findUserByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Credenciales inválidas');

    let enrichedUser: any = user;

    switch (user.rol) {
      case RolUsuario.ADMIN:
      case RolUsuario.OFICINISTA: {
        const usuarioCoop = await this.usuarioCooperativaService.findByUsuarioId(user.id);
        enrichedUser = {
          ...user,
          usuarioCooperativaId: usuarioCoop.id,
          cooperativaTransporte: usuarioCoop.cooperativaTransporte,
        };
        break;
      }

      case RolUsuario.CHOFER: {
        const chofer = await this.choferService.findByUsuarioId(user.id);
        enrichedUser = {
          ...user,
          choferId: chofer.id,
          numeroLicencia: chofer.numeroLicencia,
          tipoLicencia: chofer.tipoLicencia,
          tipoSangre: chofer.tipoSangre,
          fechaNacimiento: chofer.fechaNacimiento,
          cooperativaTransporte: chofer.cooperativaTransporte,
        };
        break;
      }

      case RolUsuario.CLIENTE: {
        const cliente = await this.clienteService.findByUsuarioId(user.id);
        enrichedUser = {
          ...user,
          clienteId: cliente.id,
          esDiscapacitado: cliente.esDiscapacitado,
          porcentajeDiscapacidad: cliente.porcentajeDiscapacidad,
          fechaNacimiento: cliente.fechaNacimiento,
        };
        break;
      }

      // SUPERADMIN y CONTROLADOR no necesitan enriquecimiento adicional
    }

    const payload = {
      sub: user.id,
      email: user.email,
      rol: user.rol,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: enrichedUser,
    };
  }

  async findUserByEmail(email: string) {
    const result = await this.db
      .select()
      .from(usuarios)
      .where(eq(usuarios.email, email))
      .limit(1);

    return result[0] || null;
  }
}
