import { ApiProperty } from '@nestjs/swagger';

export class CreateCiudadDto {
  @ApiProperty({
    description: 'Nombre de la provincia a la que pertenece la ciudad',
    example: 'Tungurahua',
  })
  provincia: string;

  @ApiProperty({
    description: 'Nombre de la ciudad',
    example: 'Ambato',
  })
  ciudad: string;
}
