import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsOptional,
  IsDateString,
  IsDecimal,
  Min,
  IsArray,
} from 'class-validator';
import { CreateBoletoDto } from '../../boletos/dto/create-boleto.dto';
import { Type } from 'class-transformer';
import { ValidateNested, ArrayMinSize } from 'class-validator';
import { PosicionAsiento } from 'configuracion-asientos/dto/create-configuracion-asientos.dto';

export class CreateVentaDto {
  @ApiProperty({ description: 'ID de la cooperativa' })
  @IsNumber()
  cooperativaId: number;

  @ApiProperty({ description: 'ID del método de pago' })
  @IsNumber()
  metodoPagoId: number;

  @ApiProperty({ description: 'Hoja de trabajo Id' })
  @IsNumber()
  hojaTrabajoId: number;

  @ApiProperty({ description: 'Estado del pago', example: 'pagado' })
  @IsString()
  estadoPago: string;

  @ApiProperty({ description: 'ID del bus' })
  @IsNumber()
  busId: number;

  //  @ApiProperty({ description: 'URL del comprobante', required: false })
  //  @IsOptional()
  //  @IsString()
  //  comprobanteUrl?: string;

  //  @ApiProperty({ description: 'Fecha de la venta' })
  //  @IsDateString()
  //  fechaVenta: string;

  @ApiProperty({ description: 'Tipo de venta', example: 'online' })
  @IsString()
  tipoVenta: string;

  /*  @ApiProperty({ description: 'Total sin descuento' })
  @IsDecimal()
  @Min(0)
  totalSinDescuento: number;

  @ApiProperty({ description: 'Total de descuentos' })
  @IsDecimal()
  @Min(0)
  totalDescuentos: number;

  @ApiProperty({ description: 'Total final' })
  @IsDecimal()
  @Min(0)
  totalFinal: number;
*/

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PosicionAsiento)
  posiciones: PosicionAsiento[];

  @ApiProperty({
    type: [CreateBoletoDto],
    description: 'Lista de boletos a crear',
  })
  @ValidateNested({ each: true })
  @Type(() => CreateBoletoDto)
  @ArrayMinSize(1)
  boletos: Omit<CreateBoletoDto, 'ventaId'>[];
}

export class CreateVentaPresencialDto {

  @ApiProperty({ description: 'Hoja de trabajo Id' })
  @IsNumber()
  hojaTrabajoId: number;

  @ApiProperty({ description: 'ID del bus' })
  @IsNumber()
  busId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PosicionAsiento)
  posiciones: PosicionAsiento[];

  @ApiProperty({
    type: [CreateBoletoDto],
    description: 'Lista de boletos a crear',
  })
  @ValidateNested({ each: true })
  @Type(() => CreateBoletoDto)
  @ArrayMinSize(1)
  boletos: Omit<CreateBoletoDto, 'ventaId'>[];
}

