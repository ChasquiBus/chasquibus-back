import { Ciudad } from '../../ciudades_provincias/entities/ciudad.entity';

export class Parada {
  id: number;
  ciudadId: number | null;
  direccion: string | null;
  estado: boolean | null;
  esTerminal: boolean | null;
  ciudad?: Ciudad | null;
}
