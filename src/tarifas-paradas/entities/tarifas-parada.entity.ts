import { ApiProperty } from '@nestjs/swagger';

export class TarifasParada {
  @ApiProperty({
    description: 'ID de la tarifa',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'ID de la parada de origen',
    example: 1,
  })
  ParadaOrigenId: number;

  @ApiProperty({
    description: 'ID de la parada de destino',
    example: 2,
  })
  ParadaDestinoId: number;

  @ApiProperty({
    description: 'Distancia en kilómetros entre las paradas',
    example: 10,
    required: false,
  })
  distanciaKm?: number;

  @ApiProperty({
    description: 'Tiempo estimado en minutos entre las paradas',
    example: 15,
    required: false,
  })
  tiempoEstimadoMin?: number;

  @ApiProperty({
    description: 'Costo del viaje entre las paradas',
    example: 2.50,
    required: false,
  })
  costo?: number;
}
