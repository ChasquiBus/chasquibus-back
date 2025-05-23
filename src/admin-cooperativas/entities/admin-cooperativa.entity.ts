import { UsuarioEntity } from "entities/usuario.entity";

export class UsuarioCooperativaEntity {
  id: number;
  cooperativaTransporteId: number;
  usuario: UsuarioEntity;
}