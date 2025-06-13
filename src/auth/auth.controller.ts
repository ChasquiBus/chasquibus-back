import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateClienteDto } from '../clientes/dto/create-cliente.dto';
import { ClienteEntity } from '../clientes/entities/cliente.entity';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Inicio sesión de usuario' })
  @ApiResponse({ status: 200, description: 'Inicio de sesión exitoso', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Credenciales incorrectas' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Registro de nuevo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente registrado exitosamente', type: ClienteEntity })
  @ApiResponse({ status: 400, description: 'Datos de registro inválidos' })
  @ApiResponse({ status: 409, description: 'El correo o cédula ya está registrado' })
  register(@Body() createClienteDto: CreateClienteDto) {
    return this.authService.registerCliente(createClienteDto);
  }
}
