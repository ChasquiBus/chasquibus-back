// entities/metodo-pago.entity.ts
export class MetodoPago {
    id: number;
    cooperativaId: number;
    nombre: string;
    descripcion?: string;
    procesador: string;
    configuracion: string | null;
    activo: boolean;
  }
  
  export interface ConfiguracionDeposito {
    banco: string;
    numeroCuenta: string;
    tipoCuenta: string;
    titular: string;
    identificacion: string;
    instrucciones?: string;
  }
  
  export interface ConfiguracionPaypal {
    clientId: string;
    clientSecret: string;
    mode: 'sandbox' | 'live';
    webhookId?: string;
  } 