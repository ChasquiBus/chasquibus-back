import { ApiProperty } from '@nestjs/swagger';

export class HojaTrabajoDetalladaDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  idBus: number;

  @ApiProperty()
  placa: string;

  @ApiProperty()
  imagen: string;

  @ApiProperty()
  piso_doble: boolean;

  @ApiProperty()
  total_asientos: number;

  @ApiProperty({ required: false })
  total_asientos_piso2?: number;

  @ApiProperty()
  horaSalidaProg: string;

  @ApiProperty()
  horaLlegadaProg: string;

  @ApiProperty()
  rutaId: number;

  @ApiProperty()
  codigo: string;

  @ApiProperty()
  ciudad_origen: string;

  @ApiProperty()
  ciudad_destino: string;

  @ApiProperty()
  idCooperativa: number;

  @ApiProperty()
  nombre_cooperativa: string;

  @ApiProperty()
  logo: string;

  @ApiProperty()
  estado: string;
} 