import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateResolucionDto {
  @ApiProperty({ description: 'ID de la cooperativa' })
  @IsNumber()
  @Type(() => Number)
  cooperativaId: number;

  @ApiProperty({ description: 'Fecha de emisión de la resolución', example: '2024-03-20' })
  @IsDateString()
  fechaEmision: string;

  @ApiProperty({ description: 'Fecha de vencimiento de la resolución', example: '2025-03-20' })
  @IsDateString()
  fechaVencimiento: string;

  @ApiProperty({ description: 'Estado de la resolución' })
  @IsBoolean()
  @Type(() => Boolean)
  estado: boolean;
}
