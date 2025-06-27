// dto/create-ruta.dto.ts
import { IsNumber, ValidationArguments, IsOptional, IsNotEmpty, IsBoolean, IsDateString, ValidationOptions, registerDecorator, IsArray, ArrayMinSize, ArrayMaxSize, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { DiaOperacionItemDto } from './update-ruta.dto';

export class CreateRutaDto {
  
  @Type(() => Number)
  @ApiProperty({ example: 1, description: 'ID de la parada de origen' })
  @IsNumber() @IsNotEmpty() 
  paradaOrigenId: number;

  @Type(() => Number)
  @ApiProperty({ example: 2, description: 'ID de la parada de destino' })
  @IsNumber() @IsNotEmpty() 
  paradaDestinoId: number;

  @Type(() => Number)
  @ApiPropertyOptional({ example: 1, description: 'Nivel de prioridad de la ruta (1 = alta, 3 = baja)' })
  @IsOptional() @IsNumber()
  prioridad?: number;

  @ApiPropertyOptional({ example: true, description: 'Indica si es ruta directa o no' })
  @IsOptional() @IsBoolean()
  esDirecto?: boolean;

  @ApiPropertyOptional({ example: '2025-06-01', description: 'Fecha de inicio de vigencia (YYYY-MM-DD)' })
  @IsOptional() @IsDateString()
  fechaIniVigencia?: string;

  @ApiPropertyOptional({ example: '2025-12-31', description: 'Fecha de fin de vigencia (YYYY-MM-DD)' })
  @IsOptional() @IsDateString()
  fechaFinVigencia?: string;

  @ApiPropertyOptional({ example: true, description: 'Estado de la ruta (activa/inactiva)' })
  @IsOptional() @IsBoolean()
  estado?: boolean;

  @ApiProperty({
    example: [
      { diaId: 1, tipo: 'operacion' },
      { diaId: 2, tipo: 'parada' },
      { diaId: 3, tipo: 'operacion' },
      { diaId: 4, tipo: 'parada' },
      { diaId: 5, tipo: 'operacion' },
      { diaId: 6, tipo: 'operacion' },
      { diaId: 7, tipo: 'parada' }
    ],
    description: 'Lista de días con su tipo (operacion/parada), del 1 al 7 sin omitir ninguno',
    required: true
  })
  @IsArray()
  @ArrayMinSize(7, { message: 'Se deben incluir exactamente 7 días.' })
  @ArrayMaxSize(7, { message: 'Se deben incluir exactamente 7 días.' })
  @ValidateNested({ each: true })
  @Type(() => DiaOperacionItemDto)
  @ContieneDiasDelUnoAlSiete()
  diasOperacion: DiaOperacionItemDto[];
}

function ContieneDiasDelUnoAlSiete(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'contieneDiasDelUnoAlSiete',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: DiaOperacionItemDto[], args: ValidationArguments) {
          if (!Array.isArray(value)) return false;
          const dias = value.map(v => v.diaId);
          const unicos = new Set(dias);
          for (let i = 1; i <= 7; i++) {
            if (!unicos.has(i)) return false;
          }
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return `Debe proporcionar exactamente un elemento para cada día del 1 al 7 sin omisiones.`;
        }
      },
    });
  };
}
