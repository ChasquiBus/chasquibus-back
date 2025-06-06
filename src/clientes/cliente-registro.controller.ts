import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ClientesService } from './clientes.service';
import { Body, Controller, Post } from '@nestjs/common';
import { ClienteEntity } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';

@Controller('cliente-registro')
@ApiTags('cliente-registro')
export class ClientesRegistroController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  @ApiOperation({ summary: 'Registro de Clientes' })
  @ApiOkResponse({ type: ClienteEntity })
  create(@Body() createClienteDto: CreateClienteDto) {
    return this.clientesService.create(createClienteDto);
  }
}
