// dto/create-metodo-pago.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsNotEmpty, ValidateNested, IsEnum, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export enum TipoMetodoPago {
  DEPOSITO = 'deposito',
  PAYPAL = 'paypal'
}

export enum TipoCuenta {
  AHORROS = 'ahorros',
  CORRIENTE = 'corriente'
}

export class ConfiguracionDepositoDto {
  @ApiProperty({ description: 'Nombre del banco', example: 'Banco Pichincha' })
  @IsString()
  @IsNotEmpty()
  banco: string;

  @ApiProperty({ description: 'Número de cuenta bancaria', example: '1234567890' })
  @IsString()
  @IsNotEmpty()
  numeroCuenta: string;

  @ApiProperty({ description: 'Tipo de cuenta', enum: TipoCuenta, example: TipoCuenta.AHORROS })
  @IsEnum(TipoCuenta)
  tipoCuenta: TipoCuenta;

  @ApiProperty({ description: 'Nombre del titular de la cuenta', example: 'Cooperativa de Transporte XYZ' })
  @IsString()
  @IsNotEmpty()
  titular: string;

  @ApiProperty({ description: 'Número de identificación del titular', example: '1234567890001' })
  @IsString()
  @IsNotEmpty()
  identificacion: string;

  @ApiProperty({ description: 'Instrucciones adicionales para el depósito', required: false })
  @IsString()
  @IsOptional()
  instrucciones?: string;
}

export class ConfiguracionPaypalDto {
  @ApiProperty({ description: 'Client ID de PayPal', example: 'AYsWLXgH...' })
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty({ description: 'Client Secret de PayPal', example: 'EHLZn...' })
  @IsString()
  @IsNotEmpty()
  clientSecret: string;

  @ApiProperty({ description: 'Modo de PayPal', enum: ['sandbox', 'live'], example: 'sandbox' })
  @IsEnum(['sandbox', 'live'])
  mode: 'sandbox' | 'live';

  @ApiProperty({ description: 'ID del webhook de PayPal', required: false })
  @IsString()
  @IsOptional()
  webhookId?: string;
}

export class CreateMetodoPagoDto {

  @ApiProperty({ description: 'Nombre del método de pago', example: 'Depósito Banco Pichincha' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ description: 'Descripción del método de pago', required: false })
  @IsString()
  @IsOptional()
  descripcion?: string;

  @ApiProperty({ description: 'Tipo de método de pago', enum: TipoMetodoPago, example: TipoMetodoPago.DEPOSITO })
  @IsEnum(TipoMetodoPago)
  procesador: TipoMetodoPago;

  @ApiProperty({ description: 'Configuración para depósito bancario', type: ConfiguracionDepositoDto, required: false })
  @ValidateNested()
  @Type(() => ConfiguracionDepositoDto)
  @IsOptional()
  configuracionDeposito?: ConfiguracionDepositoDto;

  @ApiProperty({ description: 'Configuración para PayPal', type: ConfiguracionPaypalDto, required: false })
  @ValidateNested()
  @Type(() => ConfiguracionPaypalDto)
  @IsOptional()
  configuracionPaypal?: ConfiguracionPaypalDto;

  @ApiProperty({ description: 'Estado activo del método de pago', default: true })
  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}