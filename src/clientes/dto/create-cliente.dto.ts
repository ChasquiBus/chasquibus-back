import { CreateUserDto } from "usuarios/dto/create.usuario";
import { IsBoolean, IsDateString, IsInt, IsNotEmpty, IsOptional, Max, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateClienteDto extends CreateUserDto {

  @ApiPropertyOptional({
    description: 'Indica si el cliente es discapacitado',
    example: false,
    default: false,
  })
  @IsBoolean({ message: 'El campo esDiscapacitado debe ser un valor booleano.' })
  @IsOptional()
    esDiscapacitado?: boolean | null = null;

  @ApiPropertyOptional({
    description: 'Porcentaje de discapacidad (0 a 100)',
    example: 60,
  })
  @IsInt({ message: 'El porcentaje de discapacidad debe ser un número entero.' })
  @Min(0, { message: 'El porcentaje de discapacidad no puede ser menor a 0.' })
  @Max(100, { message: 'El porcentaje de discapacidad no puede ser mayor a 100.' })
  @IsOptional()
  porcentajeDiscapacidad?: number;

  @ApiPropertyOptional({
    description: 'Fecha de nacimiento del cliente (formato ISO)',
    example: '1990-05-15',
  })
  @IsDateString({}, { message: 'La fecha de nacimiento debe ser una fecha válida.' })
  @IsOptional()
  fechaNacimiento?: string;
}