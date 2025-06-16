import { Injectable } from '@nestjs/common';
import { CreateHojaTrabajoDto } from './dto/create-hoja-trabajo.dto';
import { UpdateHojaTrabajoDto } from './dto/update-hoja-trabajo.dto';

@Injectable()
export class HojaTrabajoService {
  create(createHojaTrabajoDto: CreateHojaTrabajoDto) {
    // Lógica para crear hoja de trabajo
    return { message: 'Hoja de trabajo creada', data: createHojaTrabajoDto };
  }

  findAll() {
    // Lógica para obtener todas las hojas de trabajo
    return { message: 'Lista de hojas de trabajo' };
  }

  findOne(id: number) {
    // Lógica para obtener una hoja de trabajo por id
    return { message: `Hoja de trabajo ${id}` };
  }

  update(id: number, updateHojaTrabajoDto: UpdateHojaTrabajoDto) {
    // Lógica para actualizar hoja de trabajo
    return { message: `Hoja de trabajo ${id} actualizada`, data: updateHojaTrabajoDto };
  }

  remove(id: number) {
    // Lógica para eliminar hoja de trabajo
    return { message: `Hoja de trabajo ${id} eliminada` };
  }
} 