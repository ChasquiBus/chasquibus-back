export class CreateBusDto {
  cooperativa_id: number;
  placa: string;
  numero_bus: string;
  marca_chasis?: string;
  marca_carroceria?: string;
  imagen?: string;
  piso_doble?: boolean;
  total_asientos: number;
}
