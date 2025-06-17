import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateCiudadDto {
  @ApiProperty({
    description: 'Nombre de la provincia a la que pertenece la ciudad',
    example: 'Tungurahua',
  })
  @IsString()
  @IsNotEmpty()
  provincia: string;

  @ApiProperty({
    description: 'Nombre de la ciudad',
    example: 'Ambato',
  })
  @IsString()
  @IsNotEmpty()
  ciudad: string;

  @ApiProperty({
    description: 'ID de la cooperativa a la que pertenece la ciudad',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  cooperativaId: number;
}
