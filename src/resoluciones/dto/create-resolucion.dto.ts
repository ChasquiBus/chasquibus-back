import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDateString, IsBoolean, IsOptional, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateResolucionDto {
  @ApiProperty({ 
    description: 'URL del documento de la resolución',
    example: 'https://ejemplo.com/resolucion.pdf',
    required: false
  })
  @IsString()
  @IsOptional()
  @MaxLength(150)
  documentoURL?: string;

  @ApiProperty({ 
    description: 'Nombre de la resolución',
    example: 'Resolución 2024-001',
    maxLength: 150
  })
  @IsString()
  @MaxLength(150)
  nombre: string;

  @ApiProperty({ 
    description: 'Descripción de la resolución',
    example: 'Resolución para la ruta Quito-Ambato',
    maxLength: 150,
    required: false
  })
  @IsString()
  @IsOptional()
  @MaxLength(150)
  descripcion?: string;

  @ApiProperty({ 
    description: 'Fecha de emisión de la resolución',
    example: '2024-03-20'
  })
  @IsDateString()
  fechaEmision: string;

  @ApiProperty({ 
    description: 'Fecha de vencimiento de la resolución',
    example: '2025-03-20'
  })
  @IsDateString()
  fechaVencimiento: string;

  @ApiProperty({ 
    description: 'Estado de la resolución',
    example: true,
    default: true
  })
  @IsBoolean()
  @Type(() => Boolean)
  estado: boolean = true;

  @ApiProperty({ 
    description: 'Indica si la resolución está en uso',
    example: true,
    default: true
  })
  @IsBoolean()
  @Type(() => Boolean)
  enUso: boolean = true;

  @ApiProperty({ 
    description: 'ID de la cooperativa',
    example: 1
  })
  @IsNumber()
  @Type(() => Number)
  cooperativaId: number;
}
