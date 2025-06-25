import { Injectable, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { ventas } from '../drizzle/schema/ventas';
import { boletos } from '../drizzle/schema/boletos';
import { CreateVentaDto } from './dto/create-venta.dto';
import { Venta } from './entities/venta.entity';
import type { Database } from '../drizzle/database';
import { CreateBoletoDto } from '../boletos/dto/create-boleto.dto';
import { clientes } from '../drizzle/schema/clientes';
import { eq } from 'drizzle-orm';

@Injectable()
export class CrearVentaService {
  constructor(@Inject(DRIZZLE) private readonly db: Database) {}

  async create(createVentaDto: any, usuarioId: number) {
    // Buscar el cliente asociado al usuarioId
    const [cliente] = await this.db.select().from(clientes).where(eq(clientes.usuarioId, usuarioId)).limit(1);
    if (!cliente) {
      throw new NotFoundException('No se encontró un cliente asociado a este usuario');
    }

    // Extraer los boletos y los datos de la venta
    const { boletos: boletosData, ...ventaData } = createVentaDto;

    // Calcular los totales a partir de los boletos
    const totalSinDescuento = boletosData.reduce((sum, b) => sum + parseFloat(b.totalSinDescPorPers), 0);
    const totalDescuentos = boletosData.reduce((sum, b) => sum + parseFloat(b.totalDescPorPers), 0);
    const totalFinal = boletosData.reduce((sum, b) => sum + parseFloat(b.totalPorPer), 0);

    // Insertar la venta
    const [nuevaVenta] = await this.db.insert(ventas).values({
      ...ventaData,
      clienteId: cliente.id,
      oficinistaId: null,
      metodoPagoId: 1,
      estadoPago: 'pagado',
      tipoVenta: 'online',
      totalSinDescuento,
      totalDescuentos,
      totalFinal,
      fechaVenta: new Date(),
    }).returning();

    // Insertar los boletos asociados a la venta
    const boletosToInsert = boletosData.map((boleto: Omit<CreateBoletoDto, 'ventaId'>) => ({
      ...boleto,
      ventaId: nuevaVenta.id,
      codigoQr: null,
    }));

    await this.db.insert(boletos).values(boletosToInsert);

    return nuevaVenta;
  }
}