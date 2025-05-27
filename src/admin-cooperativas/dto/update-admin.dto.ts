import { IsNumber, IsOptional, IsPositive } from "class-validator";
import { UpdateUsuarioDto } from "common/dto/update.usuario";


export class UpdateAdminDto extends UpdateUsuarioDto{
  @IsOptional()
  @IsNumber({}, { message: 'El ID de la cooperativa de transporte debe ser un número.' })
  @IsPositive({ message: 'El ID de la cooperativa de transporte debe ser un número positivo.' })
  cooperativaTransporteId?: number;

}