import { UsuarioEntity } from "common/entities/usuario.entity";

export class UsuarioCooperativaEntity {
  id: number;
  cooperativaTransporteId: number;
  usuario: UsuarioEntity;
}