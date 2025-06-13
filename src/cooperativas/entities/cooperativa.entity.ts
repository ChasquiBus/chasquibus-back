export class Cooperativa {
  id: number;
  nombre: string;
  ruc?: string | null;
  logo?: string | null;
  colorPrimario?: string | null;
  colorSecundario?: string | null;
  sitioWeb?: string | null;
  email?: string | null;
  telefono?: string | null;
  direccion?: string | null;
  activo?: boolean | null;
  createdAt?:  Date | null;
  updatedAt?:  Date | null;
  deletedAt?: Date | null;
}
