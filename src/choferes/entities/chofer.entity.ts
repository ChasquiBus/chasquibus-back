import { UsuarioEntity } from 'common/entities/usuario.entity';

export class Chofer {
  id: number;
  numeroLicencia: string ;
  tipoLicencia: string ;
  tipoSangre: string | null;
  fechaNacimiento: Date | null;
  usuario: UsuarioEntity;
  cooperativaTransporteId: number;
}
