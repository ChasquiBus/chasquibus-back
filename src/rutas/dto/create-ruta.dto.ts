import { IsNumber, IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRutaDto {

  @ApiProperty({ example: 1, description: 'ID de la parada de origen' })
  @IsNumber()
  @IsNotEmpty({ message: 'El ID de la parada de origen no puede estar vacío' })
  paradaOrigenId: number;
  
  @ApiProperty({ example: 2, description: 'ID de la parada de destino' })
  @IsNumber()
  @IsNotEmpty({ message: 'El ID de la parada de destino no puede estar vacío' })
  paradaDestinoId: number;

  @ApiProperty({ example: 1001, description: 'ID de la resolución asociada a la ruta' })
  @IsNumber()
  @IsNotEmpty({ message: 'El ID de la resolución no puede estar vacío' })
  resolucionId: number;

  @ApiProperty({ example: 'Ruta Central', description: 'Nombre de la ruta' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la ruta no puede estar vacío' })
  nombre: string;

  @ApiProperty({ example: 'AMB-QUI', description: 'Código identificador de la ruta' })
  @IsString()
  codigo: string;

  @ApiProperty({ example: 5, description: 'ID de la cooperativa que opera la ruta' })
  @IsNumber()
  @IsNotEmpty({ message: 'El ID de la cooperativa no puede estar vacío' })
  cooperativaId: number;

  @ApiProperty({ example: 15.3, description: 'Distancia en kilómetros de la ruta' })
  @IsNumber()
  distanciaKm: number;

  @ApiPropertyOptional({ example: '45', description: 'Duración estimada del recorrido en minutos (opcional)' })
  @IsString()
  @IsOptional()
  duracionEstimadaMin?: string;
}
