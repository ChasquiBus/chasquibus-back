// create-bus.dto.ts
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateBusDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  cooperativaId: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  choferId: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  placa: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  numeroBus: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  marcaChasis?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  marcaCarroceria?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  imagen?: string;

  @IsNotEmpty()
  @IsBoolean()
  pisoDoble: boolean;

  @IsNotEmpty()
  @IsBoolean()
  activo: boolean;
}
