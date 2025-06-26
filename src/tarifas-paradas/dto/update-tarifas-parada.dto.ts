import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsBoolean,
  IsString,
  IsNumber,
  MaxLength,
} from 'class-validator';

export class UpdateTarifasParadaDto {
  @ApiProperty({
    example: 'VIP o NORMAL',
    description: 'Tipo de asiento (opcional, máximo 10 caracteres)',
    maxLength: 10,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  tipoAsiento?: string;

  @ApiProperty({ 
    example: 25.50, 
    description: 'Valor de la tarifa en formato decimal (ej. 999.99 máx)',
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  valor?: number;

  @ApiProperty({
    example: true,
    description: 'Indica si la tarifa aplica o no',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  aplicaTarifa?: boolean;
}
