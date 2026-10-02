// Repository de Turnos
// Capa de acceso a datos - ejecuta queries SQL a traves de Prisma Client
import { Turno } from "../generated/prisma/client.js";
import { prisma } from "../config/database.js";
import { CreateTurnoInput, UpdateTurnoInput } from "../schemas/turno.schema.js";

// ==========================================
// QUERIES DE LECTURA
// ==========================================

export async function findAllTurnos(): Promise<Turno[]> {
  return prisma.turno.findMany({
    orderBy: { createdAt: "desc" },
    include: { turnoMotivos: { include: { motivo: true } } },
  });
}

export async function findTurnoById(id: number): Promise<Turno | null> {
  return prisma.turno.findUnique({
    where: { id },
    include: { turnoMotivos: { include: { motivo: true } } },
  });
}

export async function findTurnosByProveedor(proveedorId: number): Promise<Turno[]> {
  return prisma.turno.findMany({
    where: { proveedorId },
    orderBy: [{ dia: "asc" }, { hora: "asc" }],
    include: { turnoMotivos: { include: { motivo: true } } },
  });
}

export async function findTurnosByProveedorAndDia(
  proveedorId: number,
  dia: Date
): Promise<Turno[]> {
  return prisma.turno.findMany({
    where: {
      proveedorId,
      dia,
      estado: "DISPONIBLE",
    },
    orderBy: { hora: "asc" },
    include: { turnoMotivos: { include: { motivo: true } } },
  });
}

export async function findFechasConTurnos(proveedorId: number): Promise<Date[]> {
  const turnos = await prisma.turno.findMany({
    where: { proveedorId, estado: "DISPONIBLE" },
    select: { dia: true },
    distinct: ["dia"],
    orderBy: { dia: "asc" },
  });
  return turnos.map((t) => t.dia);
}

export async function findTurnosByConsumidor(consumidorId: number): Promise<Turno[]> {
  return prisma.turno.findMany({
    where: { consumidorId },
    orderBy: [{ dia: "asc" }, { hora: "asc" }],
    include: { turnoMotivos: { include: { motivo: true } } },
  });
}

// ==========================================
// QUERIES DE ESCRITURA
// ==========================================

// Crear turno con motivos asociados
export async function createTurno(data: CreateTurnoInput, motivoIds: number[]): Promise<Turno> {
  return prisma.turno.create({
    data: {
      dia: data.dia,
      hora: data.hora,
      proveedorId: data.proveedorId,
      turnoMotivos: motivoIds.length > 0
        ? { create: motivoIds.map(motivoId => ({ motivoId })) }
        : undefined,
    },
    include: { turnoMotivos: { include: { motivo: true } } },
  });
}

export async function updateTurno(id: number, data: UpdateTurnoInput): Promise<Turno> {
  return prisma.turno.update({
    where: { id },
    data,
    include: { turnoMotivos: { include: { motivo: true } } },
  });
}

export async function updateTurnoEstado(id: number, estado: string): Promise<Turno> {
  return prisma.turno.update({
    where: { id },
    data: { estado },
    include: { turnoMotivos: { include: { motivo: true } } },
  });
}

export async function deleteTurno(id: number): Promise<void> {
  await prisma.turno.delete({ where: { id } });
}

export async function findTurnoByDiaAndHora(
  dia: Date,
  hora: string,
  proveedorId: number
): Promise<Turno | null> {
  return prisma.turno.findFirst({
    where: { dia, hora, proveedorId },
  });
}
