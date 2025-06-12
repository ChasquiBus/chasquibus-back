import { ApiProperty } from '@nestjs/swagger';

export class CreateParadaDto {
  @ApiProperty({
    example: 1,
    description: 'ID de la ciudad a la que pertenece la parada. Debe coincidir con una ciudad existente en el sistema.',
  })
  ciudadId: number;

  @ApiProperty({
    example: 'Parada Central',
    description: 'Nombre identificador de la parada. Debe ser único dentro de una misma ciudad si es posible.',
  })
  nombreParada: string;

  @ApiProperty({
    example: 'Av. Bolívar y Quito',
    description: 'Dirección física donde se encuentra ubicada la parada. Puede incluir calles, avenidas o puntos de referencia.',
  })
  direccion: string;

  @ApiProperty({
    example: true,
    description: 'Indica si la parada está activa (true) o inactiva (false). Una parada inactiva no se mostrará en las rutas disponibles.',
  })
  estado: boolean;

  @ApiProperty({
    example: false,
    description: 'Especifica si la parada es una terminal principal. Esto puede influir en la lógica de planificación de rutas.',
  })
  esTerminal: boolean;
}
