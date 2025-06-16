import { PartialType } from '@nestjs/mapped-types';
import { CreateHojaTrabajoDto } from './create-hoja-trabajo.dto';

export class UpdateHojaTrabajoDto extends PartialType(CreateHojaTrabajoDto) {} 