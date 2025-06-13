import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create.usuario';

export class UpdateUsuarioDto extends PartialType(CreateUserDto) {}