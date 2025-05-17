import { IsEmail, IsNotEmpty, IsString, IsInt } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsInt()
  rol: number; // 1=admin, 2=secretaria, 3=chofer, 4=cliente
}