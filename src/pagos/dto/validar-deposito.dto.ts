import { IsString, IsUrl } from 'class-validator';

export class ValidarDepositoDto {
  @IsUrl()
  comprobanteUrl: string;

  @IsString()
  observaciones: string;
}
