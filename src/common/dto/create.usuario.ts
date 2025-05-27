import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {

  @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
  @IsEmail({}, { message: 'El formato del correo electrónico no es válido.' })
  email: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto.' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  @MaxLength(50, { message: 'La contraseña no debe exceder los 50 caracteres.' })
  password: string;

  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  nombre: string;

  @IsNotEmpty({ message: 'El apellido es obligatorio.' })
  @IsString({ message: 'El apellido debe ser una cadena de texto.' })
  apellido: string;

  @IsNotEmpty({ message: 'La cédula es obligatoria.' })
  @IsString({ message: 'La cédula debe ser una cadena de texto.' })
  @MinLength(10, { message: 'La cédula debe tener al menos 10 caracteres.' })
  @MaxLength(10, { message: 'La cédula no debe exceder los 10 caracteres.' })
  @Matches(/^\d{10}$/, { message: 'La cédula debe contener exactamente 10 dígitos numéricos.' })
  cedula: string;

  @IsOptional()
  @IsString({ message: 'El teléfono debe ser una cadena de texto.' })
  @MinLength(7, { message: 'El teléfono debe tener al menos 7 caracteres.' })
  @MaxLength(15, { message: 'El teléfono no debe exceder los 15 caracteres.' })
  telefono?: string;

  @IsOptional()
  @IsBoolean({ message: 'El campo activo debe ser un valor booleano.' })
  activo?: boolean;
}