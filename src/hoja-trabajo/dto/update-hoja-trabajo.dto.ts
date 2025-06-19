import { PartialType } from '@nestjs/swagger';
import { CreateHojaTrabajoDto } from './create-hoja-trabajo.dto';

export class UpdateHojaTrabajoDto extends PartialType(CreateHojaTrabajoDto) {} 