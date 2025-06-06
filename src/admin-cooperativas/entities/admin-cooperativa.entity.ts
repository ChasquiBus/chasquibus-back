import { UsuarioEntity } from "usuarios/entities/usuario.entity";

export class UsuarioCooperativaEntity {
  id: number;
  cooperativaTransporteId: number;
  usuario: UsuarioEntity;
}