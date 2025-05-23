
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateCooperativaDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{10,13}$/, { message: 'El RUC debe tener entre 10 y 13 dígitos' })
  ruc?: string;

  @IsOptional()
  logo?: string;

  @IsOptional()
  colorPrimario?: string;

  @IsOptional()
  colorSecundario?: string;

  @IsOptional()
  sitioWeb?: string;

  @IsOptional()
  @IsEmail({}, { message: 'El email debe tener un formato válido' })
  email?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  direccion?: string;
}


