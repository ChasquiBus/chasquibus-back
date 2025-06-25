import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsBoolean, ValidateNested, IsArray, IsEnum, Min, Max, IsOptional } from 'class-validator';
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
    example: 1,
    description: 'Número único del asiento',
    minimum: 1
  })
  @IsNumber()
  @Min(1)
  numeroAsiento: number;

  @ApiProperty({
    example: false,
    description: 'Indica si el asiento está ocupado (true) o vacío (false)',
    default: false
  })
  @IsOptional()
  ocupado?: boolean;
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
        numeroAsiento: 1
      },
      { 
        fila: 1, 
        columna: 2, 
        piso: 1, 
        tipoAsiento: 'NORMAL',
        numeroAsiento: 2
      },
      { 
        fila: 1, 
        columna: 1, 
        piso: 2, 
        tipoAsiento: 'VIP',
        numeroAsiento: 20
      },
      { 
        fila: 1, 
        columna: 2, 
        piso: 2, 
        tipoAsiento: 'NORMAL',
        numeroAsiento: 21
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
