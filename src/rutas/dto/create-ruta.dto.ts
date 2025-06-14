import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateRutaDto {
  @IsNumber()
  paradaOrigenId: number;

  @IsNumber()
  paradaDestinoId: number;

  @IsNumber()
  resolucionId: number;

  @IsString()
  nombre: string;

  @IsString()
  codigo: string;

  @IsNumber()
  cooperativaId: number;

  @IsNumber()
  distanciaKm: number;

  @IsString()
  @IsOptional()
  duracionEstimadaMin?: string;
}
