import { UsuarioEntity } from "usuarios/entities/usuario.entity";

export class ClienteEntity {
  id: number;
  esDiscapacitado: boolean|null;
  porcentajeDiscapacidad: number|null;
  fechaNacimiento: Date|null;  
  usuario: UsuarioEntity;
}