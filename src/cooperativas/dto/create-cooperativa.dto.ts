import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCooperativaDto {
  @ApiProperty({
    description: 'Nombre de la cooperativa',
    example: 'Cooperativa San José',
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre: string;

  @ApiPropertyOptional({
    description: 'RUC de la cooperativa (10 a 13 dígitos)',
    example: '1790012345001',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{10,13}$/, { message: 'El RUC debe tener entre 10 y 13 dígitos' })
  ruc?: string;

  @ApiPropertyOptional({
    description: 'URL del logo de la cooperativa',
    example: 'https://miapp.com/logos/logo.png',
  })
  @IsOptional()
  logo?: string;

  @ApiPropertyOptional({
    description: 'Color primario en formato hexadecimal',
    example: '#123456',
  })
  @IsOptional()
  colorPrimario?: string;

  @ApiPropertyOptional({
    description: 'Color secundario en formato hexadecimal',
    example: '#abcdef',
  })
  @IsOptional()
  colorSecundario?: string;

  @ApiPropertyOptional({
    description: 'Sitio web oficial de la cooperativa',
    example: 'https://www.cooperativa.com',
  })
  @IsOptional()
  sitioWeb?: string;

  @ApiPropertyOptional({
    description: 'Correo electrónico de contacto',
    example: 'info@cooperativa.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'El email debe tener un formato válido' })
  email?: string;

  @ApiPropertyOptional({
    description: 'Número de teléfono de la cooperativa',
    example: '+593987654321',
  })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiPropertyOptional({
    description: 'Dirección física de la cooperativa',
    example: 'Av. Amazonas y Naciones Unidas, Quito',
  })
  @IsOptional()
  @IsString()
  direccion?: string;
}
