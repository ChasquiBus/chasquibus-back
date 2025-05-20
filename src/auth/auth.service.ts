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

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(DRIZZLE) private readonly db: Database, 
  ) {}

  async login(dto: LoginDto) {
    const user = await this.findUserByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    // const valid = await bcrypt.compare(dto.password, user.passwordHash);
    // if (!valid) throw new UnauthorizedException('Credenciales inválidas');

    if (dto.password !== user.passwordHash) {
    throw new UnauthorizedException('Credenciales inválidas');
  }


    const payload = {
      sub: user.id,
      email: user.email,
      rol: user.rol,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user,
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
