import { PartialType } from '@nestjs/mapped-types';
import { CreateConfiguracionAsientosDto } from './create-configuracion-asientos.dto';

export class UpdateConfiguracionAsientosDto extends PartialType(CreateConfiguracionAsientosDto) {}
