import { IsDateString,  IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateUserDto } from 'common/dto/create.usuario';

export class CreateChoferDto extends CreateUserDto{

  @ApiProperty({
    description: 'Número de licencia del chofer',
    example: 'ABC123456789',
  })
  @IsString({ message: 'El número de licencia debe ser una cadena de texto.' })
  @MaxLength(20, { message: 'El número de licencia no puede tener más de 20 caracteres.' })
  numeroLicencia?: string;

  @ApiProperty({
    description: 'Tipo de licencia del chofer',
    example: 'C',
  })
  @IsString({ message: 'El tipo de licencia debe ser una cadena de texto.' })
  @MaxLength(2, { message: 'El tipo de licencia no puede tener más de 2 caracteres.' })
  @IsOptional()
  tipoLicencia?: string;

  @ApiPropertyOptional({
    description: 'Tipo de sangre del chofer',
    example: 'O+',
  })
  @IsString({ message: 'El tipo de sangre debe ser una cadena de texto.' })
  @MaxLength(10, { message: 'El tipo de sangre no puede tener más de 10 caracteres.' })
  @IsOptional()
  tipoSangre?: string;

  @ApiPropertyOptional({
    description: 'Fecha de nacimiento del chofer (formato ISO)',
    example: '1985-12-25',
  })
  @IsDateString({}, { message: 'La fecha de nacimiento debe ser una fecha válida.' })
  @IsOptional()
  fechaNacimiento?: string;
}
