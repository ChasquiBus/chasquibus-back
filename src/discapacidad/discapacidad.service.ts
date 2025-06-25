import { Injectable } from '@nestjs/common';
import { CreateDiscapacidadDto } from './dto/create-discapacidad.dto';
import { UpdateDiscapacidadDto } from './dto/update-discapacidad.dto';

@Injectable()
export class DiscapacidadService {

  findAll() {
    return `This action returns all discapacidad`;
  }

  findOne(id: number) {
    return `This action returns a #${id} discapacidad`;
  }

  update(id: number, updateDiscapacidadDto: UpdateDiscapacidadDto) {
    return `This action updates a #${id} discapacidad`;
  }

  remove(id: number) {
    return `This action removes a #${id} discapacidad`;
  }
}
