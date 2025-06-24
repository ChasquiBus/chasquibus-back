import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsDateString, IsEnum } from 'class-validator';

export enum EstadoHojaTrabajo {
  PROGRAMADO = 'programado',
  EN_CURSO = 'en curso',
  COMPLETADO = 'completado',
  SUSPENDIDO = 'suspendido',
  CANCELADO = 'cancelado'
}

export class CreateHojaTrabajoDto {
  @ApiProperty({ 
    example: 1, 
    description: 'ID del bus asignado a la hoja de trabajo',
    minimum: 1
  })
  @IsNumber()
  busId: number;

  @ApiProperty({ 
    example: 1, 
    description: 'ID del chofer asignado a la hoja de trabajo',
    minimum: 1
  })
  @IsNumber()
  choferId: number;

  @ApiProperty({ 
    example: 1, 
    description: 'ID de la frecuencia del día',
    minimum: 1
  })
  @IsNumber()
  frecDiaId: number;

  @ApiProperty({ 
    example: 'Observaciones sobre el viaje o condiciones especiales', 
    description: 'Observaciones adicionales sobre la hoja de trabajo',
    required: false,
    maxLength: 255
  })
  @IsOptional()
  @IsString()
  observaciones?: string;

  @ApiProperty({ 
    example: EstadoHojaTrabajo.PROGRAMADO,
    description: 'Estado actual de la hoja de trabajo',
    enum: EstadoHojaTrabajo
  })
  @IsEnum(EstadoHojaTrabajo)
  estado: EstadoHojaTrabajo;

  @ApiProperty({ 
    example: '2024-01-15T08:00:00Z',
    description: 'Hora real de salida del bus',
    required: false
  })
  @IsOptional()
  @IsDateString()
  horaSalidaReal?: string;

  @ApiProperty({ 
    example: '2024-01-15T18:00:00Z',
    description: 'Hora real de llegada del bus',
    required: false
  })
  @IsOptional()
  @IsDateString()
  horaLlegadaReal?: string;

  @ApiProperty({ 
    example: '2024-01-15',
    description: 'Fecha de salida programada',
    required: false
  })
  @IsOptional()
  @IsDateString()
  fechaSalida?: string;
} 