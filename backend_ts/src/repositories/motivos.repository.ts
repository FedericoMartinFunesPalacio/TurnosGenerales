// Repository de Motivos
// CRUD de motivos frecuentes por proveedor
import { PrismaClient, Motivo } from "../generated/prisma/client.js";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

// Obtener un motivo por ID
export async function findMotivoById(id: number): Promise<Motivo | null> {
  return prisma.motivo.findUnique({ where: { id } });
}

// Obtener todos los motivos de un proveedor (ordenados por uso)
export async function findMotivosByProveedor(proveedorId: number): Promise<Motivo[]> {
  return prisma.motivo.findMany({
    where: { proveedorId },
    orderBy: { usageCount: "desc" },
  });
}

// Buscar motivo por texto y proveedor
export async function findMotivoByTexto(texto: string, proveedorId: number): Promise<Motivo | null> {
  return prisma.motivo.findUnique({
    where: { texto_proveedorId: { texto, proveedorId } },
  });
}

// Crear un motivo nuevo
export async function createMotivo(texto: string, proveedorId: number): Promise<Motivo> {
  return prisma.motivo.create({
    data: { texto, proveedorId },
  });
}

// Incrementar usageCount de un motivo
export async function incrementUsage(motivoId: number): Promise<void> {
  await prisma.motivo.update({
    where: { id: motivoId },
    data: { usageCount: { increment: 1 } },
  });
}

// Eliminar un motivo
export async function deleteMotivo(id: number): Promise<void> {
  await prisma.motivo.delete({ where: { id } });
}

// Obtener o crear un motivo (upsert)
export async function getOrCreateMotivo(texto: string, proveedorId: number): Promise<Motivo> {
  const existente = await findMotivoByTexto(texto, proveedorId);
  if (existente) {
    await incrementUsage(existente.id);
    return existente;
  }
  return createMotivo(texto, proveedorId);
}
