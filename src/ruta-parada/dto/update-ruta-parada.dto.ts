import { PartialType } from '@nestjs/mapped-types';
import { CreateRutaParadaDto } from './create-ruta-parada.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum EstadoRutaParada {
  ACTIVA = 'activa',
  INACTIVA = 'inactiva',
  SUSPENDIDA = 'suspendida',
}

export class UpdateRutaParadaDto extends PartialType(CreateRutaParadaDto) {
  @ApiProperty({
    description: 'Estado de la parada en la ruta',
    enum: EstadoRutaParada,
    example: EstadoRutaParada.ACTIVA,
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsEnum(EstadoRutaParada)
  estado?: EstadoRutaParada;
}
