import { PartialType } from '@nestjs/swagger';
import { CreateParadaDto } from './create-parada.dto';

export class UpdateParadaDto extends PartialType(CreateParadaDto) {}
