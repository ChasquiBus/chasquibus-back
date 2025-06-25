import { PartialType } from '@nestjs/swagger';
import { CreateDiscapacidadDto } from './create-discapacidad.dto';

export class UpdateDiscapacidadDto extends PartialType(CreateDiscapacidadDto) {}
