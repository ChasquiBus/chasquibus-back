// update-bus.dto.ts
import { IsBoolean, IsNumber, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';

export class UpdateBusDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  cooperativaId?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  choferId?: number;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  placa?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  numeroBus?: string;

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

  @IsOptional()
  @IsBoolean()
  pisoDoble?: boolean;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
