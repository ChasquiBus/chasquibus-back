import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsDateString } from 'class-validator';

export class CreateFrecuenciaDto {
  @ApiProperty({ example: 1, description: 'ID de la ruta a la que pertenece esta frecuencia' })
  @IsNumber()
  rutaId: number;

  @ApiProperty({ example: '06:00:00', description: 'Hora programada de salida en formato HH:mm:ss' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, { message: 'La horaSalidaProg debe tener el formato HH:mm:ss' })
  horaSalidaProg: string;

  @ApiProperty({ example: '10:00:00', description: 'Hora programada de llegada en formato HH:mm:ss' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, { message: 'La horaLlegadaProg debe tener el formato HH:mm:ss' })
  horaLlegadaProg: string;


  @ApiProperty({ example: 'activa', description: 'Estado de la frecuencia' })
  @IsString()
  estado: string;
}
