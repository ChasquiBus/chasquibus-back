import { Ciudad } from "./ciudad.entity";

export class Provincia {
  id: number;
  nombre: string;
}

export class ProvinciaConCiudades {
  id: number;
  nombre: string;
  ciudades: Ciudad[];
}