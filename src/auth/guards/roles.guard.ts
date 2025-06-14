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
    const requiredRoles = this.reflector.getAllAndOverride<RolUsuario[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;

    console.log(`[RolesGuard] Usuario con rol ${user.rol} intentando acceder a ${request.method} ${request.url}`);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // No roles requeridos
    }

    if (!requiredRoles.includes(user.rol)) {
      throw new ForbiddenException('No tienes acceso a este recurso');
    }

    return true;
  }
}