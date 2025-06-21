import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateTarifasParadaDto {
  @ApiProperty({ example: 1, description: 'ID de la ruta asociada' })
  @IsInt()
  @IsNotEmpty()
  rutaId: number;

  @ApiProperty({ example: 10, description: 'ID de la parada de origen' })
  @IsInt()
  @IsNotEmpty()
  paradaOrigenId: number;

  @ApiProperty({ example: 20, description: 'ID de la parada de destino' })
  @IsInt()
  @IsNotEmpty()
  paradaDestinoId: number;

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

  @ApiProperty({ example: 25.50, description: 'Valor de la tarifa en formato decimal (ej. 999.99 máx)' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  valor: number;

  @ApiProperty({
    example: true,
    description: 'Indica si la tarifa aplica o no',
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  aplicaTarifa?: boolean;
}