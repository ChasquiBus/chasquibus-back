import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsPositive } from 'class-validator';

export class CreateBusDto {
  @ApiProperty({ description: 'ID de la cooperativa a la que pertenece el bus.' })
  @IsNumber({}, { message: 'El ID de la cooperativa debe ser un número.' })
  @IsNotEmpty({ message: 'El ID de la cooperativa es obligatorio.' })
  cooperativa_id: number;

  @ApiProperty({ description: 'Placa única del bus (máximo 10 caracteres).', example: 'ABC-1234' })
  @IsString({ message: 'La placa debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La placa es obligatoria.' })
  placa: string;

  @ApiProperty({ description: 'Número identificador del bus (máximo 10 caracteres).' })
  @IsString({ message: 'El número de bus debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El número de bus es obligatorio.' })
  numero_bus: string;

  @ApiPropertyOptional({ description: 'Marca del chasis del bus (máximo 50 caracteres).', example: 'Mercedes-Benz' })
  @IsString({ message: 'La marca del chasis debe ser una cadena de texto.' })
  @IsOptional()
  marca_chasis?: string;

  @ApiPropertyOptional({ description: 'Marca de la carrocería del bus (máximo 50 caracteres).', example: 'Masa' })
  @IsString({ message: 'La marca de la carrocería debe ser una cadena de texto.' })
  @IsOptional()
  marca_carroceria?: string;

  @ApiPropertyOptional({ description: 'Nombre de archivo de la imagen del bus.' })
  @IsString({ message: 'La imagen debe ser una cadena de texto.' })
  @IsOptional()
  imagen?: string;

  @ApiPropertyOptional({ description: 'Indica si el bus es de dos pisos.', example: false })
  @IsBoolean({ message: 'El valor de piso_doble debe ser booleano.' })
  @IsOptional()
  piso_doble?: boolean;

  @ApiProperty({ description: 'Número total de asientos del bus.', example: 40 })
  @IsNumber({}, { message: 'El total de asientos debe ser un número.' })
  @IsNotEmpty({ message: 'El total de asientos es obligatorio.' })
  @IsPositive({ message: 'El total de asientos debe ser un número positivo.' })
  total_asientos: number;

  @ApiPropertyOptional({ description: 'Estado activo del bus.', example: true })
  @IsBoolean({ message: 'El estado activo debe ser booleano.' })
  @IsOptional()
  activo?: boolean;
}
