import { PartialType } from '@nestjs/swagger';
import { CreateResolucionDto } from './create-resolucion.dto';

export class UpdateResolucionDto extends PartialType(CreateResolucionDto) {
  documentoURL?: string;
}
