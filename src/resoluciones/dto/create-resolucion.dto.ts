import { IsDateString, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateResolucionAntDto {
  @IsOptional()
  @IsString()
  documentoURL?: string;

  @IsDateString()
  fechaEmision: string;

  @IsDateString()
  fechaVencimiento: string;

  @IsBoolean()
  estado: boolean;
}