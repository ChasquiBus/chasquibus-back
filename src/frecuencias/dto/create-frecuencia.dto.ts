import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject, IsString } from 'class-validator';

export class CreateFrecuenciaDto {
  @ApiProperty({ example: 1, description: 'ID de la ruta a la que pertenece esta frecuencia' })
  @IsNumber()
  rutaId: number;

  @ApiProperty({ example: { "lun": true, "mar": true }, description: 'Días de operación de la frecuencia' })
  @IsObject()
  diasOperacion: any;

  @ApiProperty({ example: { "lun": true, "mar": true }, description: 'Días en que la frecuencia para en cada parada' })
  @IsObject()
  diasParada: any;

  @ApiProperty({ example: '2025-06-15', description: 'Fecha de inicio de vigencia' })
  @IsString()
  fechaIniVigencia: string;

  @ApiProperty({ example: '2025-12-31', description: 'Fecha de fin de vigencia' })
  @IsString()
  fechaFinVigencia: string;

  @ApiProperty({ example: 'Activa', description: 'Estado de la frecuencia' })
  @IsString()
  estado: string;
} 