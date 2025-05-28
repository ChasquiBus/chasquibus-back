import { UsuarioEntity } from "common/entities/usuario.entity";

export class ClienteEntity {
  id: number;
  es_discapacitado: boolean;
  porcentaje_discapacidad: number|null;
  fecha_nacimiento: Date|null;  
  usuario: UsuarioEntity;
}