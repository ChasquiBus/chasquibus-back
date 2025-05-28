import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

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

  @ApiProperty({ example: '25.50', description: 'Precio base como string' })
  @IsString() // porque mencionaste que es string en la DB
  precioBase: string;

  @ApiProperty({
    example: '[{"fila":1,"columna":1},{"fila":1,"columna":2}]',
    description: 'Posiciones de los asientos en formato JSON',
  })
  @IsString()
  posicionesJson: string;
}
