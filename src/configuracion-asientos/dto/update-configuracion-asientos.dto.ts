import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray } from 'class-validator';

export class UpdateConfiguracionAsientosDto {
  @ApiProperty({ required: false, type: 'array', items: { type: 'object' } })
  @IsOptional()
  @IsArray()
  posiciones?: { numeroAsiento: number; ocupado: boolean }[];

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  posicionesJson?: string;
}
