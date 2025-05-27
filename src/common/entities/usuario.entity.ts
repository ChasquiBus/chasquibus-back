export class UsuarioEntity {
  id: number;
  email: string;
  nombre: string | null;
  apellido: string | null;
  cedula: string;
  telefono: string | null;
  activo: boolean;
  rol: number;
  createdAt: Date | null;;
  updatedAt: Date | null;;
  deletedAt: Date | null;
}
