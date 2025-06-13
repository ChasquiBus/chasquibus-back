import { Cooperativa } from 'cooperativas/entities/cooperativa.entity';
import { UsuarioEntity } from 'usuarios/entities/usuario.entity';

export class Chofer {
  id: number;
  numeroLicencia: string ;
  tipoLicencia: string ;
  tipoSangre: string | null;
  fechaNacimiento: Date | null;
  usuario: UsuarioEntity;
  cooperativaTransporte: Cooperativa|null;
}
