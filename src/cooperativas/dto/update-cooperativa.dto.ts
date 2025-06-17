import { PartialType } from '@nestjs/mapped-types';
import { CreateCooperativaDto } from './create-cooperativa.dto';

export class UpdateCooperativaDto extends PartialType(CreateCooperativaDto) {}
