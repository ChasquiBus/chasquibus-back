import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateTarifasParadaDto {
  @ApiProperty({
    description: 'ID de la parada de origen',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  ParadaOrigenId: number;

  @ApiProperty({
    description: 'ID de la parada de destino',
    example: 2,
  })
  @IsNumber()
  @IsNotEmpty()
  ParadaDestinoId: number;

  @ApiProperty({
    description: 'Distancia en kilómetros entre las paradas',
    example: 10,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  distanciaKm?: number;

  @ApiProperty({
    description: 'Tiempo estimado en minutos entre las paradas',
    example: 15,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  tiempoEstimadoMin?: number;

  @ApiProperty({
    description: 'Costo del viaje entre las paradas',
    example: 2.50,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  costo?: number;
}
