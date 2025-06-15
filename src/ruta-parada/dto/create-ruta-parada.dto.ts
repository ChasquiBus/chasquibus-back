import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateRutaParadaDto {
  @ApiProperty({
    description: 'ID de la ruta',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  rutaId: number;

  @ApiProperty({
    description: 'ID de la parada',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  paradaId: number;

  @ApiProperty({
    description: 'Orden de la parada en la ruta',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  orden: number;

  @ApiProperty({
    description: 'Distancia desde el origen en kilómetros',
    example: 10,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  distanciaDesdeOrigenKm?: number;

  @ApiProperty({
    description: 'Tiempo desde el origen en minutos',
    example: 15,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  tiempoDesdeOrigenMin?: number;
} 