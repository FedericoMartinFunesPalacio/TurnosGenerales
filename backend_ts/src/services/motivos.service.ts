// Service de Motivos
import { Motivo } from "../generated/prisma/client.js";
import * as motivosRepository from "../repositories/motivos.repository.js";
import { AppError } from "../middlewares/error.handler.js";

export async function getMotivosByProveedor(proveedorId: number): Promise<Motivo[]> {
  return motivosRepository.findMotivosByProveedor(proveedorId);
}

export async function createMotivo(texto: string, proveedorId: number): Promise<Motivo> {
  if (!texto || texto.trim().length < 2) {
    throw new AppError("El motivo debe tener al menos 2 caracteres", 400);
  }
  const existente = await motivosRepository.findMotivoByTexto(texto.trim(), proveedorId);
  if (existente) {
    throw new AppError("Ya existe un motivo con ese texto", 409);
  }
  return motivosRepository.createMotivo(texto.trim(), proveedorId);
}

export async function deleteMotivo(id: number): Promise<void> {
  const motivo = await motivosRepository.findMotivoById(id);
  if (!motivo) throw new AppError("Motivo no encontrado", 404);
  await motivosRepository.deleteMotivo(id);
}

export async function getOrCreateMotivos(textos: string[], proveedorId: number): Promise<Motivo[]> {
  const motivos: Motivo[] = [];
  for (const texto of textos) {
    if (texto && texto.trim().length >= 2) {
      const motivo = await motivosRepository.getOrCreateMotivo(texto.trim(), proveedorId);
      motivos.push(motivo);
    }
  }
  return motivos;
}
