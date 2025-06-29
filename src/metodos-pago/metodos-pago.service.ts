// metodos-pago.service.ts
import { Injectable, Inject, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { metodosPago } from '../drizzle/schema/metodos-pago';
import { eq, and } from 'drizzle-orm';
import { CreateMetodoPagoDto, TipoMetodoPago } from './dto/create-metodo-pago.dto';
import { UpdateMetodoPagoDto } from './dto/update-metodo-pago.dto';
import { MetodoPago, ConfiguracionDeposito, ConfiguracionPaypal } from './entity/metodo-pago.entity';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { RolUsuario } from '../auth/roles.enum';
import type { Database } from '../drizzle/database';

@Injectable()
export class MetodosPagoService {
  constructor(@Inject(DRIZZLE) private readonly db: Database) {}

  /**
   * Crear un nuevo método de pago
   */
  async create(createMetodoPagoDto: CreateMetodoPagoDto, user: JwtPayload): Promise<MetodoPago> {
    // Validar que el usuario tenga cooperativaId
    if (!user.cooperativaId) {
      throw new BadRequestException('El usuario no tiene una cooperativa asignada');
    }

    const { configuracionDeposito, configuracionPaypal, procesador, ...baseData } = createMetodoPagoDto;
    
    // Validar que se proporcione la configuración correcta según el tipo
    let configuracion: string;
    
    if (procesador === TipoMetodoPago.DEPOSITO) {
      if (!configuracionDeposito) {
        throw new BadRequestException('La configuración de depósito es requerida para este tipo de método de pago');
      }
      configuracion = JSON.stringify(configuracionDeposito);
    } else if (procesador === TipoMetodoPago.PAYPAL) {
      if (!configuracionPaypal) {
        throw new BadRequestException('La configuración de PayPal es requerida para este tipo de método de pago');
      }
      configuracion = JSON.stringify(configuracionPaypal);
    } else {
      throw new BadRequestException('Tipo de procesador no válido');
    }

    const [nuevoMetodoPago] = await this.db
      .insert(metodosPago)
      .values({
        ...baseData,
        cooperativaId: user.cooperativaId, // Usar cooperativaId del token
        procesador,
        configuracion,
        activo: baseData.activo ?? true
      })
      .returning();

    return this.formatMetodoPago(nuevoMetodoPago);
  }

  /**
   * Obtener todos los métodos de pago (filtrado por cooperativa según el rol)
   */
  async findAll(user: JwtPayload): Promise<MetodoPago[]> {
    let metodos;

    if (user.rol === RolUsuario.ADMIN) {
      // Admin puede ver todos los métodos de pago
      metodos = await this.db.select().from(metodosPago);
    } else {
      // Otros roles solo ven los de su cooperativa
      if (!user.cooperativaId) {
        throw new BadRequestException('El usuario no tiene una cooperativa asignada');
      }
      metodos = await this.db
        .select()
        .from(metodosPago)
        .where(eq(metodosPago.cooperativaId, user.cooperativaId));
    }
    
    return metodos.map(metodo => this.formatMetodoPago(metodo));
  }

  /**
   * Obtener métodos de pago activos de la cooperativa del usuario
   */
  async findActiveByUser(user: JwtPayload): Promise<MetodoPago[]> {
    if (!user.cooperativaId) {
      throw new BadRequestException('El usuario no tiene una cooperativa asignada');
    }

    const metodos = await this.db
      .select()
      .from(metodosPago)
      .where(and(
        eq(metodosPago.cooperativaId, user.cooperativaId),
        eq(metodosPago.activo, true)
      ));
    
    return metodos.map(metodo => this.formatMetodoPago(metodo));
  }

  /**
   * Obtener métodos de pago por cooperativa específica (solo para admin)
   */
  async findByCooperativa(cooperativaId: number, user: JwtPayload): Promise<MetodoPago[]> {
    if (user.rol !== RolUsuario.ADMIN) {
      throw new ForbiddenException('Solo los administradores pueden consultar métodos de pago de otras cooperativas');
    }

    const metodos = await this.db
      .select()
      .from(metodosPago)
      .where(eq(metodosPago.cooperativaId, cooperativaId));
    
    return metodos.map(metodo => this.formatMetodoPago(metodo));
  }

  /**
   * Obtener un método de pago por ID (validando permisos)
   */
  async findOne(id: number, user: JwtPayload): Promise<MetodoPago> {
    const [metodoPago] = await this.db
      .select()
      .from(metodosPago)
      .where(eq(metodosPago.id, id));

    if (!metodoPago) {
      throw new NotFoundException(`Método de pago con ID ${id} no encontrado`);
    }

    // Validar que el usuario tenga acceso al método de pago
    if (user.rol !== RolUsuario.ADMIN && metodoPago.cooperativaId !== user.cooperativaId) {
      throw new ForbiddenException('No tiene permisos para acceder a este método de pago');
    }

    return this.formatMetodoPago(metodoPago);
  }

  /**
   * Actualizar un método de pago
   */
  async update(id: number, updateMetodoPagoDto: UpdateMetodoPagoDto, user: JwtPayload): Promise<MetodoPago> {
    const metodoExistente = await this.findOne(id, user);
    
    const { configuracionDeposito, configuracionPaypal, procesador, ...baseData } = updateMetodoPagoDto;
    
    let configuracion: string | undefined;
    
    // Si se actualiza el procesador, validar la configuración correspondiente
    if (procesador) {
      if (procesador === TipoMetodoPago.DEPOSITO) {
        if (!configuracionDeposito) {
          throw new BadRequestException('La configuración de depósito es requerida para este tipo de método de pago');
        }
        configuracion = JSON.stringify(configuracionDeposito);
      } else if (procesador === TipoMetodoPago.PAYPAL) {
        if (!configuracionPaypal) {
          throw new BadRequestException('La configuración de PayPal es requerida para este tipo de método de pago');
        }
        configuracion = JSON.stringify(configuracionPaypal);
      }
    } else {
      // Si no se cambia el procesador, actualizar solo la configuración correspondiente
      if (metodoExistente.procesador === TipoMetodoPago.DEPOSITO && configuracionDeposito) {
        configuracion = JSON.stringify(configuracionDeposito);
      } else if (metodoExistente.procesador === TipoMetodoPago.PAYPAL && configuracionPaypal) {
        configuracion = JSON.stringify(configuracionPaypal);
      }
    }

    const updateData: any = { ...baseData };
    if (procesador) updateData.procesador = procesador;
    if (configuracion) updateData.configuracion = configuracion;

    const [metodoPagoActualizado] = await this.db
      .update(metodosPago)
      .set(updateData)
      .where(eq(metodosPago.id, id))
      .returning();

    return this.formatMetodoPago(metodoPagoActualizado);
  }

  /**
   * Eliminar un método de pago (soft delete - cambiar activo a false)
   */
  async remove(id: number, user: JwtPayload): Promise<void> {
    const metodo = await this.findOne(id, user);
    
    await this.db
      .update(metodosPago)
      .set({ activo: false })
      .where(eq(metodosPago.id, id));
  }

  /**
   * Activar/Desactivar un método de pago
   */
  async toggleActive(id: number, user: JwtPayload): Promise<MetodoPago> {
    const metodo = await this.findOne(id, user);
    
    const [metodoPagoActualizado] = await this.db
      .update(metodosPago)
      .set({ activo: !metodo.activo })
      .where(eq(metodosPago.id, id))
      .returning();

    return this.formatMetodoPago(metodoPagoActualizado);
  }

  /**
   * Formatear método de pago para la respuesta
   */
  private formatMetodoPago(metodo: any): MetodoPago {
    return {
      id: metodo.id,
      cooperativaId: metodo.cooperativaId,
      nombre: metodo.nombre,
      descripcion: metodo.descripcion,
      procesador: metodo.procesador,
      configuracion: metodo.configuracion,
      activo: metodo.activo
    };
  }

  /**
   * Obtener configuración de depósito parseada
   */
  async getConfiguracionDeposito(id: number, user: JwtPayload): Promise<ConfiguracionDeposito> {
    const metodo = await this.findOne(id, user);
    
    if (metodo.procesador !== TipoMetodoPago.DEPOSITO) {
      throw new BadRequestException('El método de pago no es de tipo depósito');
    }

    if (!metodo.configuracion) {
      throw new BadRequestException('El método de pago no tiene configuración válida');
    }

    return JSON.parse(metodo.configuracion);
  }

  /**
   * Obtener configuración de PayPal parseada
   */
  async getConfiguracionPaypal(id: number, user: JwtPayload): Promise<ConfiguracionPaypal> {
    const metodo = await this.findOne(id, user);
    
    if (metodo.procesador !== TipoMetodoPago.PAYPAL) {
      throw new BadRequestException('El método de pago no es de tipo PayPal');
    }

    if (!metodo.configuracion) {
      throw new BadRequestException('El método de pago no tiene configuración válida');
    }

    return JSON.parse(metodo.configuracion);
  }
}