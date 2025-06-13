import { Cooperativa } from "cooperativas/entities/cooperativa.entity";
import { UsuarioEntity } from "usuarios/entities/usuario.entity";

export class UsuarioCooperativaEntity {
  id: number;
  cooperativaTransporte: Cooperativa | null;
  usuario: UsuarioEntity;
}