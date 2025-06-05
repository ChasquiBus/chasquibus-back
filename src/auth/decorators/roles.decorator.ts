import { SetMetadata } from "@nestjs/common";
import { RolUsuario } from "auth/roles.enum";

export const ROLES_KEY = 'rol';
export const Role = (rol: RolUsuario) => SetMetadata(ROLES_KEY, rol);