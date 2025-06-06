import { ApiProperty } from "@nestjs/swagger";
import {IsNotEmpty, IsNumber,  IsPositive} from "class-validator";
import { CreateUserDto } from "usuarios/dto/create.usuario";

export class CreateAdminDto extends CreateUserDto{

  @ApiProperty({example: "2",description:"El Id de la cooperativa a asignarse" })
  @IsNotEmpty({ message: 'El ID de la cooperativa de transporte es obligatorio.' })
  @IsNumber({}, { message: 'El ID de la cooperativa de transporte debe ser un número.' })
  @IsPositive({ message: 'El ID de la cooperativa de transporte debe ser un número positivo.' })
  cooperativaTransporteId: number;

}
