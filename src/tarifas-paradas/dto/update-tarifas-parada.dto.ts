import { PartialType } from '@nestjs/swagger';
import { CreateTarifasParadaDto } from './create-tarifas-parada.dto';

export class UpdateTarifasParadaDto extends PartialType(CreateTarifasParadaDto) {}
