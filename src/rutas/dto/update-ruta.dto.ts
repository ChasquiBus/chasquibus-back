import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateRutaDto  {

    @Type(() => Number)
    @ApiProperty({ example: 1, description: 'ID de la parada de origen' })
    @IsNumber() @IsNotEmpty() @IsOptional()
    paradaOrigenId: number;
  
    @Type(() => Number)
    @ApiProperty({ example: 2, description: 'ID de la parada de destino' })
    @IsNumber() @IsNotEmpty() @IsOptional()
    paradaDestinoId: number;
  
    @Type(() => Number)
    @ApiPropertyOptional({ example: 1, description: 'Nivel de prioridad de la ruta (1 = alta, 3 = baja)' })
    @IsOptional() @IsNumber()
    prioridad?: number;
  
    @ApiPropertyOptional({ example: '2025-06-01', description: 'Fecha de inicio de vigencia (YYYY-MM-DD)' })
    @IsOptional() @IsDateString()
    fechaIniVigencia?: string;
  
    @ApiPropertyOptional({ example: '2025-12-31', description: 'Fecha de fin de vigencia (YYYY-MM-DD)' })
    @IsOptional() @IsDateString()
    fechaFinVigencia?: string;
  
    @ApiPropertyOptional({ example: true, description: 'Estado de la ruta (activa/inactiva)' })
    @IsOptional() @IsBoolean()
    estado?: boolean;

    @IsOptional()
    @ApiProperty({
        example: [
          { diaId: 1, tipo: 'operacion' },
          { diaId: 7, tipo: 'parada' }
        ],
        description: 'Lista de días con su tipo (operacion/parada)',
        required: false
      })
      @IsOptional()
      @ValidateNested({ each: true })
      @Type(() => DiaOperacionItemDto)
      diasOperacion?: DiaOperacionItemDto[];
}


export class DiaOperacionItemDto {
    @ApiProperty({ example: 1, description: 'Número del día (1=Lunes, ..., 7=Domingo)' })
    @IsInt()
    @Min(1)
    @Max(7)
    diaId: number;
  
    @ApiProperty({ example: 'operacion', description: 'Tipo de día' })
    @IsString()
    @IsIn(['operacion', 'parada'])
    tipo: 'operacion' | 'parada';
  }