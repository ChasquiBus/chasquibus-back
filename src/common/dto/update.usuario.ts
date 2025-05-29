import { IsBoolean, IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUsuarioDto {

  @ApiPropertyOptional({ example: 'nuevo@correo.com', description: 'Correo electrónico actualizado' })
  @IsOptional()
  @IsEmail({}, { message: 'El formato del correo electrónico no es válido.' })
  email?: string;

  @ApiPropertyOptional({ example: 'NuevaClaveSegura123', description: 'Nueva contraseña (mínimo 8 caracteres)' })
  @IsOptional()
  @IsString({ message: 'La contraseña debe ser una cadena de texto.' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  password?: string;

  @ApiPropertyOptional({ example: 'Carlos', description: 'Nuevo nombre del usuario' })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres.' })
  nombre?: string;

  @ApiPropertyOptional({ example: 'García', description: 'Nuevo apellido del usuario' })
  @IsOptional()
  @IsString({ message: 'El apellido debe ser una cadena de texto.' })
  @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres.' })
  apellido?: string;

  @ApiPropertyOptional({ example: '0987654321', description: 'Nueva cédula (10 dígitos numéricos)' })
  @IsOptional()
  @IsString({ message: 'La cédula debe ser una cadena de texto.' })
  @MinLength(10, { message: 'La cédula debe tener al menos 10 caracteres.' })
  @MaxLength(10, { message: 'La cédula no debe exceder los 10 caracteres.' })
  @Matches(/^\d{10}$/, { message: 'La cédula debe contener exactamente 10 dígitos numéricos.' })
  cedula?: string;

  @ApiPropertyOptional({ example: '+593998877665', description: 'Nuevo teléfono del usuario' })
  @IsOptional()
  @IsString({ message: 'El teléfono debe ser una cadena de texto.' })
  @MinLength(7, { message: 'El teléfono debe tener al menos 7 caracteres.' })
  @MaxLength(15, { message: 'El teléfono no debe exceder los 15 caracteres.' })
  @Matches(/^\+?\d+$/, { message: 'El teléfono solo puede contener dígitos y opcionalmente un "+" al inicio.' })
  telefono?: string;

  @ApiPropertyOptional({ example: false, description: 'Actualizar estado activo del usuario' })
  @IsOptional()
  @IsBoolean({ message: 'El campo activo debe ser un valor booleano.' })
  activo?: boolean;
}
