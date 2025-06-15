import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateResolucionDto } from './create-resolucion.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateResolucionDto extends PartialType(CreateResolucionDto) {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'URL del documento de la resolución',
    example: 'https://www.cooperativa.com/resoluciones/123456.pdf',
    nullable: true,
  })
  documentoURL?: string;
}
