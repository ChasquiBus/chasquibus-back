import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class WebhookPaypalDto {
  @ApiProperty({ 
    description: 'Estado del pago en PayPal', 
    example: 'COMPLETED',
    required: false 
  })
  @IsString()
  @IsOptional()
  paymentStatus?: string;

  @ApiProperty({ 
    description: 'ID de la transacción de PayPal', 
    example: 'TXN123456',
    required: false 
  })
  @IsString()
  @IsOptional()
  transactionId?: string;
} 