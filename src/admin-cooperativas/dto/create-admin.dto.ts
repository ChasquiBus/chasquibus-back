import {IsNotEmpty, IsNumber,  IsPositive} from "class-validator";
import { CreateUserDto } from "common/dto/create.usuario";

export class CreateAdminDto extends CreateUserDto{
  @IsNotEmpty({ message: 'El ID de la cooperativa de transporte es obligatorio.' })
  @IsNumber({}, { message: 'El ID de la cooperativa de transporte debe ser un número.' })
  @IsPositive({ message: 'El ID de la cooperativa de transporte debe ser un número positivo.' })
  cooperativaTransporteId: number;

}
