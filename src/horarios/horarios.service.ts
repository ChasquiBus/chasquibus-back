import { Injectable } from '@nestjs/common';
import { CreateHorarioDto } from './dto/create-horario.dto';
import { UpdateHorarioDto } from './dto/update-horario.dto';
import { db } from '../drizzle/database';
import { schema } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class HorariosService {
  async create(createHorarioDto: CreateHorarioDto) {
    // Mapear campos del DTO a los del esquema (camelCase)
  }

  async findAll(query?: any) {

  }

  async findOne(id: number) {

  }

  async update(id: number, updateHorarioDto: UpdateHorarioDto) {

  }

  async remove(id: number) {

  }
} 