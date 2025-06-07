import { Module } from "@nestjs/common";
import { UsuarioService } from "./usuarios.service";

@Module({
providers:[UsuarioService],
exports:[UsuarioService]
})

export class UsuariosModule{}
