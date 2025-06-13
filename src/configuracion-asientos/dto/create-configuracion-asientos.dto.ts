import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsBoolean, ValidateNested, IsArray, IsEnum, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export enum TipoAsiento {
  NORMAL = 'NORMAL',
  VIP = 'VIP'
}

class PosicionAsiento {
  @ApiProperty({ 
    example: 1, 
    description: 'Número de fila del asiento',
    minimum: 1
  })
  @IsNumber()
  @Min(1)
  fila: number;

  @ApiProperty({ 
    example: 1, 
    description: 'Número de columna del asiento',
    minimum: 1
  })
  @IsNumber()
  @Min(1)
  columna: number;

  @ApiProperty({ 
    example: 1, 
    description: 'Número de piso (1 = primer piso, 2 = segundo piso). En el primer piso solo se permiten asientos NORMAL',
    minimum: 1,
    maximum: 2
  })
  @IsNumber()
  @Min(1)
  @Max(2)
  piso: number;

  @ApiProperty({ 
    example: 'NORMAL', 
    description: 'Tipo de asiento. En el primer piso solo se permiten asientos NORMAL. En el segundo piso pueden ser VIP o NORMAL',
    enum: TipoAsiento,
    default: TipoAsiento.NORMAL
  })
  @IsEnum(TipoAsiento)
  tipoAsiento: TipoAsiento;

  @ApiProperty({ 
    example: '25.50', 
    description: 'Precio del asiento. Los asientos VIP deben tener un precio mayor que los asientos NORMAL. Máximo 2 decimales',
    pattern: '^\\d+(\\.\\d{1,2})?$'
  })
  @IsString()
  precio: string;
}

export class CreateConfiguracionAsientosDto {
  @ApiProperty({ 
    example: 1, 
    description: 'ID del bus al que pertenece esta configuración de asientos',
    minimum: 1
  })
  @IsNumber()
  @Min(1)
  busId: number;

  @ApiProperty({
    example: [
      { 
        fila: 1, 
        columna: 1, 
        piso: 1, 
        tipoAsiento: 'NORMAL',
        precio: '25.50'
      },
      { 
        fila: 1, 
        columna: 2, 
        piso: 1, 
        tipoAsiento: 'NORMAL',
        precio: '25.50'
      },
      { 
        fila: 1, 
        columna: 1, 
        piso: 2, 
        tipoAsiento: 'VIP',
        precio: '35.50'
      },
      { 
        fila: 1, 
        columna: 2, 
        piso: 2, 
        tipoAsiento: 'NORMAL',
        precio: '30.50'
      }
    ],
    description: `Array de posiciones de asientos. Reglas importantes:
    1. En el primer piso (piso: 1) solo se permiten asientos NORMAL
    2. En el segundo piso (piso: 2) pueden ser VIP o NORMAL
    3. Los precios de asientos VIP deben ser mayores que los asientos NORMAL
    4. Las filas y columnas deben ser números positivos
    5. Los precios deben tener máximo 2 decimales
    6. El número total de asientos no puede exceder el total definido en el bus`,
    type: [PosicionAsiento]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PosicionAsiento)
  posiciones: PosicionAsiento[];
}
