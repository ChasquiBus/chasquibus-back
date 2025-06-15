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
    maxLength: 100
  })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({
    description: 'RUC de la cooperativa (10 a 13 dígitos)',
    maxLength: 20,
    example: '1790012345001'
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{10,13}$/, { message: 'El RUC debe tener entre 10 y 13 dígitos' })
  ruc: string;

  @ApiPropertyOptional({
    description: 'URL del logo de la cooperativa',
    maxLength: 255,
    example: 'https://miapp.com/logos/logo.png'
  })
  @IsString()
  @IsOptional()
  logo?: string;

  @ApiPropertyOptional({
    description: 'Color primario en formato hexadecimal',
    maxLength: 20,
    example: '#123456'
  })
  @IsString()
  @IsOptional()
  colorPrimario?: string;

  @ApiPropertyOptional({
    description: 'Color secundario en formato hexadecimal',
    maxLength: 20,
    example: '#abcdef'
  })
  @IsString()
  @IsOptional()
  colorSecundario?: string;

  @ApiPropertyOptional({
    description: 'Sitio web oficial de la cooperativa',
    maxLength: 255,
    example: 'https://www.cooperativa.com'
  })
  @IsString()
  @IsOptional()
  sitioWeb?: string;

  @ApiPropertyOptional({
    description: 'Correo electrónico de contacto',
    maxLength: 100,
    example: 'info@cooperativa.com'
  })
  @IsOptional()
  @IsEmail({}, { message: 'El email debe tener un formato válido' })
  email?: string;

  @ApiPropertyOptional({
    description: 'Número de teléfono de la cooperativa',
    maxLength: 20,
    example: '+593987654321'
  })
  @IsString()
  @IsOptional()
  telefono?: string;

  @ApiPropertyOptional({
    description: 'Dirección física de la cooperativa',
    maxLength: 255,
    example: 'Av. Amazonas y Naciones Unidas, Quito'
  })
  @IsString()
  @IsOptional()
  direccion?: string;
}
