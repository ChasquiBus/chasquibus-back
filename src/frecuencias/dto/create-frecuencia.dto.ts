import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsDateString } from 'class-validator';

export class CreateFrecuenciaDto {
  @ApiProperty({ example: 1, description: 'ID de la ruta a la que pertenece esta frecuencia' })
  @IsNumber()
  rutaId: number;

  @ApiProperty({ example: '06:00:00', description: 'Hora programada de salida en formato HH:mm:ss' })
  @IsDateString()
  horaSalidaProg: string;

  @ApiProperty({ example: '10:00:00', description: 'Hora programada de llegada en formato HH:mm:ss' })
  @IsDateString()
  horaLlegadaProg: string;

  @ApiProperty({ example: 'activa', description: 'Estado de la frecuencia' })
  @IsString()
  estado: string;
}
