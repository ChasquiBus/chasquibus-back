import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {

  @ApiProperty({ example: 'usuario@ejemplo.com', description: 'Correo electrónico del usuario' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
  @IsEmail({}, { message: 'El formato del correo electrónico no es válido.' })
  email: string;

  @ApiProperty({ example: 'MiClaveSegura123', description: 'Contraseña del usuario (mínimo 8 caracteres)' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto.' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  @MaxLength(50, { message: 'La contraseña no debe exceder los 50 caracteres.' })
  password: string;

  @ApiProperty({ example: 'Juan', description: 'Nombre del usuario' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  nombre: string;
  
  @ApiProperty({ example: 'Pérez', description: 'Apellido del usuario' })
  @IsNotEmpty({ message: 'El apellido es obligatorio.' })
  @IsString({ message: 'El apellido debe ser una cadena de texto.' })
  apellido: string;

  @ApiProperty({ example: '1234567890', description: 'Cédula del usuario, 10 dígitos numéricos' })
  @IsNotEmpty({ message: 'La cédula es obligatoria.' })
  @IsString({ message: 'La cédula debe ser una cadena de texto.' })
  @MinLength(10, { message: 'La cédula debe tener al menos 10 caracteres.' })
  @MaxLength(10, { message: 'La cédula no debe exceder los 10 caracteres.' })
  @Matches(/^\d{10}$/, { message: 'La cédula debe contener exactamente 10 dígitos numéricos.' })
  cedula: string;

  @ApiPropertyOptional({ example: '+593987654321', description: 'Teléfono del usuario (opcional)' })
  @IsOptional()
  @IsString({ message: 'El teléfono debe ser una cadena de texto.' })
  @MinLength(7, { message: 'El teléfono debe tener al menos 7 caracteres.' })
  @MaxLength(15, { message: 'El teléfono no debe exceder los 15 caracteres.' })
  telefono?: string;

  @ApiPropertyOptional({ example: true, description: 'Estado activo del usuario (opcional)' })
  @IsOptional()
  @IsBoolean({ message: 'El campo activo debe ser un valor booleano.' })
  activo?: boolean;
}
