import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsBoolean, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

class PosicionAsiento {
  @ApiProperty({ example: 1, description: 'Número de fila' })
  @IsNumber()
  fila: number;

  @ApiProperty({ example: 1, description: 'Número de columna' })
  @IsNumber()
  columna: number;

  @ApiProperty({ example: 1, description: 'Número de piso (1 o 2)' })
  @IsNumber()
  piso: number;
}

export class CreateConfiguracionAsientosDto {
  @ApiProperty({ example: 1, description: 'ID del bus' })
  @IsNumber()
  busId: number;

  @ApiProperty({ example: 'VIP', description: 'Tipo de asiento' })
  @IsString()
  tipoAsiento: string;

  @ApiProperty({ example: 30, description: 'Cantidad de asientos' })
  @IsNumber()
  cantidad: number;

  @ApiProperty({ example: '25.50', description: 'Precio base' })
  @IsString()
  precioBase: string;

  @ApiProperty({
    example: [
      { fila: 1, columna: 1, piso: 1 },
      { fila: 1, columna: 2, piso: 1 }
    ],
    description: 'Posiciones de los asientos',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PosicionAsiento)
  posiciones: PosicionAsiento[];
}
