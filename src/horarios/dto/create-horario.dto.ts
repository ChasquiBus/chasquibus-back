export class CreateHorarioDto {
  frecuencia_id: number;
  fecha_salida: Date;
  fecha_llegada: Date;
  hoja_trabajo_id: number;
  hora_salida_prog: Date;
  hora_llegada_prog: Date;
  hora_salida_real?: Date;
  hora_llegada_real?: Date;
} 