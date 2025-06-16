import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateHojaTrabajoDto {
  @ApiProperty({ example: 1, description: 'ID del bus' })
  @IsNumber()
  bus_id: number;

  @ApiProperty({ example: 7, description: 'ID del chofer' })
  @IsNumber()
  chofer_id: number;

  @ApiProperty({ example: 0, description: 'ID del controlador', required: false })
  @IsOptional()
  @IsNumber()
  controlador_id?: number;

  @ApiProperty({ example: 'Observaciones', required: false })
  @IsOptional()
  @IsString()
  observaciones?: string;

  @ApiProperty({ example: 'Activa', description: 'Estado de la hoja de trabajo' })
  @IsString()
  estado: string;
} 