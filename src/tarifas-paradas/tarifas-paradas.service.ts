import { Injectable } from '@nestjs/common';
import { CreateTarifasParadaDto } from './dto/create-tarifas-parada.dto';
import { UpdateTarifasParadaDto } from './dto/update-tarifas-parada.dto';

@Injectable()
export class TarifasParadasService {
  create(createTarifasParadaDto: CreateTarifasParadaDto) {
    return 'This action adds a new tarifasParada';
  }

  findAll() {
    return `This action returns all tarifasParadas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tarifasParada`;
  }

  update(id: number, updateTarifasParadaDto: UpdateTarifasParadaDto) {
    return `This action updates a #${id} tarifasParada`;
  }

  remove(id: number) {
    return `This action removes a #${id} tarifasParada`;
  }
}
