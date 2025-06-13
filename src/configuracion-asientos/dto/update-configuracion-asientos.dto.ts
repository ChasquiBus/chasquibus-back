import { PartialType } from '@nestjs/mapped-types';
import { CreateConfiguracionAsientosDto } from './create-configuracion-asientos.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateConfiguracionAsientosDto extends PartialType(CreateConfiguracionAsientosDto) {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  posicionesJson?: string;
}
