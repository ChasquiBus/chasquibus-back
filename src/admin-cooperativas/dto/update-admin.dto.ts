import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class UpdateAdminDto {
  @IsOptional()
  @IsNumber({}, { message: 'El ID de la cooperativa de transporte debe ser un número.' })
  @IsPositive({ message: 'El ID de la cooperativa de transporte debe ser un número positivo.' })
  cooperativaTransporteId?: number;

  @IsOptional()
  @IsEmail({}, { message: 'El formato del correo electrónico no es válido.' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'La contraseña debe ser una cadena de texto.' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  password?: string;

  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres.' })
  nombre?: string;

  @IsOptional()
  @IsString({ message: 'El apellido debe ser una cadena de texto.' })
  @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres.' })
  apellido?: string;

  @IsOptional()
  @IsString({ message: 'La cédula debe ser una cadena de texto.' })
  @MinLength(10, { message: 'La cédula debe tener al menos 10 caracteres.' })
  @MaxLength(10, { message: 'La cédula no debe exceder los 10 caracteres.' })
  @Matches(/^\d{10}$/, { message: 'La cédula debe contener exactamente 10 dígitos numéricos.' })
  cedula?: string;

  @IsOptional()
  @IsString({ message: 'El teléfono debe ser una cadena de texto.' })
  @MinLength(7, { message: 'El teléfono debe tener al menos 7 caracteres.' })
  @MaxLength(15, { message: 'El teléfono no debe exceder los 15 caracteres.' })
  @Matches(/^\+?\d+$/, { message: 'El teléfono solo puede contener dígitos y opcionalmente un "+" al inicio.' })
  telefono?: string;

  @IsOptional()
  @IsBoolean({ message: 'El campo activo debe ser un valor booleano.' })
  activo?: boolean;
}