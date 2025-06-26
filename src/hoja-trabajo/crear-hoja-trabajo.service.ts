import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateHojaTrabajoDto } from './dto/create-hoja-trabajo.dto';
import { UpdateHojaTrabajoDto } from './dto/update-hoja-trabajo.dto';
import { db } from '../drizzle/database';
import { hojaTrabajo } from '../drizzle/schema/hoja-trabajo';
import { buses } from '../drizzle/schema/bus';
import { choferes } from '../drizzle/schema/choferes';
import { eq } from 'drizzle-orm';


@Injectable()
export class CrearHojaTrabajoService {
  async createAutomatically(createHojaTrabajoDto: CreateHojaTrabajoDto) {

  }
}