import { SetMetadata } from "@nestjs/common";
import { RolUsuario } from "auth/roles.enum";

export const ROLES_KEY = 'roles';
export const Role = (...roles: RolUsuario[]) => SetMetadata(ROLES_KEY, roles);