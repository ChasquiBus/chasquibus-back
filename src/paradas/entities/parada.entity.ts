import { Ciudad } from '../../ciudades/entities/ciudad.entity';

export class Parada {
  id: number;
  ciudadId: number | null;
  nombreParada: string | null;
  direccion: string | null;
  estado: boolean | null;
  esTerminal: boolean | null;
  ciudad?: Ciudad | null;
}
