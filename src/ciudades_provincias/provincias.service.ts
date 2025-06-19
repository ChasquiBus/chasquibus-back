import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../drizzle/database';
import { ciudades, provincias } from '../drizzle/schema/ciudades';
import { eq } from 'drizzle-orm';
import { ProvinciaConCiudades } from './entities/provincia.entity';

@Injectable()
export class ProvinciasService {

  async findAllProvinciasConCiudades(): Promise<ProvinciaConCiudades[]> {
    const rows = await db
      .select({
        pid: provincias.id,
        pnombre: provincias.nombre,
        cid: ciudades.id,
        cciudad: ciudades.ciudad,
        ccodigo: ciudades.codigo,
        cprovinciaId: ciudades.provincia_id,
      })
      .from(provincias)
      .leftJoin(ciudades, eq(provincias.id, ciudades.provincia_id))
      .orderBy(provincias.nombre, ciudades.ciudad);
  
    const resultado: ProvinciaConCiudades[] = [];
  
    const mapProv = new Map<number, ProvinciaConCiudades>();
  
    for (const r of rows) {
      let prov = mapProv.get(r.pid);
  
      if (!prov) {
        prov = {
          id: r.pid,
          nombre: r.pnombre,
          ciudades: [],
        };
        mapProv.set(r.pid, prov);
        resultado.push(prov);
      }
  
      // Agregar ciudad si existe
      if (r.cid !== null && r.cciudad !== null && r.cprovinciaId !== null) {
        prov.ciudades.push({
          id: r.cid,
          ciudad: r.cciudad,
          codigo: r.ccodigo,
          provincia_id: r.cprovinciaId,
        });
      }
    }
  
    return resultado;
  }


  async findOne(id: number) {
    const result = await db.select().from(provincias).where(eq(provincias.id, id));
    return result[0] ?? null;
  }

  async findCiudadesByProvincia(idProvincia: number) {
    return await db
      .select({
        id: ciudades.id,
        ciudad: ciudades.ciudad,
        codigo: ciudades.codigo,
      })
      .from(ciudades)
      .where(eq(ciudades.provincia_id, idProvincia))
      .orderBy(ciudades.ciudad);
  }

  // Nueva función que valida y luego retorna ciudades
  async findCiudadesByProvinciaConCheck(idProvincia: number) {
    const provincia = await this.findOne(idProvincia);
    if (!provincia) {
      throw new NotFoundException(`Provincia con ID ${idProvincia} no encontrada`);
    }
    return this.findCiudadesByProvincia(idProvincia);
  }
}