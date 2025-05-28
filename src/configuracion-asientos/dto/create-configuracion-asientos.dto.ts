import { IsNotEmpty, IsNumber, IsString, IsDecimal } from 'class-validator';

export class CreateConfiguracionAsientosDto {
  @IsNumber()
  busId: number;

  @IsString()
  tipoAsiento: string;

  @IsNumber()
  cantidad: number;

  @IsString() 
  precioBase: string;

  @IsString()
  posicionesJson: string;
}
