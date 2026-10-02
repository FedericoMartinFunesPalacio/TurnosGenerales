import { Usuario } from "../generated/prisma/client.js";
import { CreateUsuarioInput, LoginUsuarioInput, ResetPasswordInput } from "../schemas/usuario.schema.js";
import * as usuarioRepository from "../repositories/usuarios.repository.js";
import { AppError } from "../middlewares/error.handler.js";

export async function getAllUsuarios(): Promise<Partial<Usuario>[]> {
  return usuarioRepository.findAllUsuarios();
}

export async function getUsuarioById(id: number): Promise<Partial<Usuario>> {
  const usuario = await usuarioRepository.findUsuarioById(id);
  if (!usuario) throw new AppError("Usuario no encontrado", 404);
  return usuario;
}

export async function createUsuario(data: CreateUsuarioInput): Promise<Partial<Usuario>> {
  const emailExiste = await usuarioRepository.existsByEmail(data.email);
  if (emailExiste) throw new AppError("El email ya esta registrado", 409);
  return usuarioRepository.createUsuario(data);
}

// Login por email (no mas username)
export async function loginUsuario(data: LoginUsuarioInput): Promise<Partial<Usuario>> {
  const usuario = await usuarioRepository.findUsuarioByEmail(data.email);
  if (!usuario) throw new AppError("Credenciales invalidas", 401);
  if (usuario.password !== data.password) throw new AppError("Credenciales invalidas", 401);
  const { password: _, ...usuarioSinPassword } = usuario;
  return usuarioSinPassword;
}

export async function resetPassword(data: ResetPasswordInput): Promise<void> {
  const usuario = await usuarioRepository.findUsuarioByEmail(data.email);
  if (!usuario) throw new AppError("No se encontro un usuario con ese email", 404);
  await usuarioRepository.updatePassword(usuario.id, data.newPassword);
}

export async function getUsuariosByRole(role: string): Promise<Partial<Usuario>[]> {
  const rolesValidos = ["ADMIN", "CONSUMIDOR", "PROVEEDOR"];
  if (!rolesValidos.includes(role)) throw new AppError("Rol no valido", 400);
  return usuarioRepository.findUsuariosByRole(role);
}
