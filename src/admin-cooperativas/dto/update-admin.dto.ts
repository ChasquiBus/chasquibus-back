import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsPositive } from "class-validator";
import { UpdateUsuarioDto } from "usuarios/dto/update.usuario";


export class UpdateAdminDto extends UpdateUsuarioDto{
  @ApiProperty({example: "2",description:"El Id de la cooperativa a cambiar" })
  @IsOptional()
  @IsNumber({}, { message: 'El ID de la cooperativa de transporte debe ser un número.' })
  @IsPositive({ message: 'El ID de la cooperativa de transporte debe ser un número positivo.' })
  cooperativaTransporteId?: number;

}