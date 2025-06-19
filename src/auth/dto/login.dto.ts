import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';


export class LoginDto {
  @ApiProperty({
    example: 'adminbaños@hotmail.com',
    description: 'Correo electrónico del usuario',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'admin123', description: 'Contraseña del usuario' })
  @IsString()
  password: string;
}


export class LoginResponseDto {
  @ApiProperty({ example: '12345', description: 'ID del usuario' })
  id: string;
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token: string;
  @ApiProperty({ example: '1', description: 'Rol: 1=Admin, 2=Oficinista, 3=Chofer, 4=Cliente, 5=Superadministrador' })
  rol: string;
}