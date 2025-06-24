import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, ValidateNested, IsIn, Matches, IsInt, Min, Max } from 'class-validator';


export class UpdateFrecuenciaDto {

  @ApiProperty({ example: '06:00:00', description: 'Hora programada de salida en formato HH:mm:ss' })
  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, { message: 'La horaSalidaProg debe tener el formato HH:mm:ss' })
  horaSalidaProg: string;

  @ApiProperty({ example: '10:00:00', description: 'Hora programada de llegada en formato HH:mm:ss' })
  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, { message: 'La horaLlegadaProg debe tener el formato HH:mm:ss' })
  horaLlegadaProg: string;

} 