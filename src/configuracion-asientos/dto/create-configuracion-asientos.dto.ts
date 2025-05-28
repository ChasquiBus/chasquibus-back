import { IsNotEmpty, IsNumber, IsString, IsDecimal } from 'class-validator';

export class CreateConfiguracionAsientosDto {
  @IsNumber()
  busId: number;

  @IsString()
  tipoAsiento: string;
//tener presente que el tipo de dato precioBase esta como string y no decimal ojo 
  @IsNumber()
  cantidad: number;

  @IsString() 
  precioBase: string;

  @IsString()
  posicionesJson: string;
}
