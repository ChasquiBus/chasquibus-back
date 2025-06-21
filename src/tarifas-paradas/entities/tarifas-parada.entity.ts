import { ApiProperty } from '@nestjs/swagger';

export class TarifasParada {
  @ApiProperty({ example: 1, description: 'ID único de la tarifa' })
  id: number;

  @ApiProperty({ example: 1, description: 'ID de la ruta asociada' })
  rutaId: number;

  @ApiProperty({ example: 10, description: 'ID de la parada de origen' })
  paradaOrigenId: number;

  @ApiProperty({ example: 20, description: 'ID de la parada de destino' })
  paradaDestinoId: number;

  @ApiProperty({ 
    example: 'VIP', 
    description: 'Tipo de asiento (VIP, NORMAL, etc.)',
    required: false 
  })
  tipoAsiento?: string;

  @ApiProperty({ 
    example: '25.50', 
    description: 'Valor de la tarifa en formato decimal' 
  })
  valor: string;

  @ApiProperty({ 
    example: true, 
    description: 'Indica si la tarifa aplica o no',
    default: true 
  })
  aplicaTarifa: boolean;
}
