import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateHorarioDto {
  @ApiProperty()
  @IsNumber()
  frecuencia_id: number;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  fecha_salida: Date;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  fecha_llegada: Date;

  @ApiProperty()
  @IsNumber()
  hoja_trabajo_id: number;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  hora_salida_prog: Date;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  hora_llegada_prog: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  hora_salida_real?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  hora_llegada_real?: Date;
} 