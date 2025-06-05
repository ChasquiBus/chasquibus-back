import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtPayload } from 'auth/interfaces/jwt-payload.interface';
import { RolUsuario } from 'auth/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRol = this.reflector.getAllAndOverride<RolUsuario>('rol', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (requiredRol === undefined) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;

    if (user.rol !== requiredRol) {
      throw new ForbiddenException('No tienes acceso a este recurso');
    }

    return true;
  }
}