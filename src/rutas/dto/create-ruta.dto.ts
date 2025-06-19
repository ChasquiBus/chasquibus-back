// dto/create-ruta.dto.ts
import { IsNumber, IsString, IsOptional, IsNotEmpty, IsBoolean, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateRutaDto {
  
  @Type(() => Number)
  @ApiProperty({ example: 1, description: 'ID de la parada de origen' })
  @IsNumber() @IsNotEmpty() 
  paradaOrigenId: number;

  @Type(() => Number)
  @ApiProperty({ example: 2, description: 'ID de la parada de destino' })
  @IsNumber() @IsNotEmpty() 
  paradaDestinoId: number;

  @Type(() => Number)
  @ApiPropertyOptional({ example: 1, description: 'Nivel de prioridad de la ruta (1 = alta, 3 = baja)' })
  @IsOptional() @IsNumber()
  prioridad?: number;

  @ApiPropertyOptional({ example: '2025-06-01', description: 'Fecha de inicio de vigencia (YYYY-MM-DD)' })
  @IsOptional() @IsDateString()
  fechaIniVigencia?: string;

  @ApiPropertyOptional({ example: '2025-12-31', description: 'Fecha de fin de vigencia (YYYY-MM-DD)' })
  @IsOptional() @IsDateString()
  fechaFinVigencia?: string;

  @ApiPropertyOptional({ example: true, description: 'Estado de la ruta (activa/inactiva)' })
  @IsOptional() @IsBoolean()
  estado?: boolean;
}
