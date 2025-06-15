import { RolUsuario } from "auth/roles.enum";

export interface JwtPayload{
    sub: number;
    email:string;
    rol: RolUsuario;
    cooperativaId?: number | null;
}