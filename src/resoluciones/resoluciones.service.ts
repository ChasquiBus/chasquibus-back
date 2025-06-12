import { Injectable } from '@nestjs/common';
import { CreateResolucionDto } from './dto/create-resolucion.dto';
import { UpdateResolucionDto } from './dto/update-resolucion.dto';

@Injectable()
export class ResolucionesService {
  create(createResolucioneDto: CreateResolucionDto) {
    return 'This action adds a new resolucione';
  }

  findAll() {
    return `This action returns all resoluciones`;
  }

  findOne(id: number) {
    return `This action returns a #${id} resolucione`;
  }

  update(id: number, updateResolucioneDto: UpdateResolucionDto) {
    return `This action updates a #${id} resolucione`;
  }

  remove(id: number) {
    return `This action removes a #${id} resolucione`;
  }
}
