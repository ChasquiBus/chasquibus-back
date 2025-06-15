import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsBoolean } from 'class-validator';

export class CreateParadaDto {
  @ApiProperty({
    description: 'ID de la ciudad donde se encuentra la parada',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  ciudadId: number;

  @ApiProperty({
    description: 'Nombre de la parada',
    example: 'Terminal Terrestre',
  })
  @IsString()
  @IsNotEmpty()
  nombreParada: string;

  @ApiProperty({
    description: 'Dirección de la parada',
    example: 'Av. Principal 123',
  })
  @IsString()
  @IsNotEmpty()
  direccion: string;

  @ApiProperty({
    description: 'Indica si la parada es una terminal',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  esTerminal: boolean;

  @ApiProperty({
    description: 'ID de la cooperativa a la que pertenece la parada',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  cooperativaId: number;
}
