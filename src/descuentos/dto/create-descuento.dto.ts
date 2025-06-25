import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDecimal, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateDescuentoDto {
  @ApiProperty({ example: 'adulto mayor', description: 'Tipo de descuento aplicado' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  tipoDescuento: string;

  @ApiProperty({ example: true, description: 'Indica si requiere validación manual' })
  @IsBoolean()
  requiereValidacion: boolean;

  @ApiProperty({ example: 15.5, description: 'Porcentaje de descuento (hasta dos decimales)' })
  @IsDecimal({ decimal_digits: '0,2' })
  porcentaje: number;

  @ApiProperty({ example: 'activo', description: 'Estado actual del descuento' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  estado: string;
}
