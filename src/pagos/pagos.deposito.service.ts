import { Injectable } from '@nestjs/common';

@Injectable()
export class DepositoService {
  generarInstrucciones(venta) {
    const referencia = `DEP-${venta.id}-${Date.now()}`;
    return {
      mensaje: 'Deposite a cuenta X y cargue el comprobante',
      referencia,
    };
  }
}
