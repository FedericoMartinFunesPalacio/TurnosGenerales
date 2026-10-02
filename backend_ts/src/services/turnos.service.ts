import { Turno } from "../generated/prisma/client.js";
import { CreateTurnoInput, UpdateTurnoInput } from "../schemas/turno.schema.js";
import * as turnoRepository from "../repositories/turnos.repository.js";
import * as usuarioRepository from "../repositories/usuarios.repository.js";
import * as motivosService from "../services/motivos.service.js";
import * as emailService from "./email.service.js";
import { AppError } from "../middlewares/error.handler.js";

function getFullName(user: { nombre?: string; apellidos?: string } | null): string {
  if (!user) return "Usuario";
  return `${user.nombre || ""} ${user.apellidos || ""}`.trim() || "Usuario";
}

export async function getAllTurnos(): Promise<Turno[]> {
  return turnoRepository.findAllTurnos();
}

export async function getTurnoById(id: number): Promise<Turno> {
  const turno = await turnoRepository.findTurnoById(id);
  if (!turno) throw new AppError("Turno no encontrado", 404);
  return turno;
}

export async function getTurnosByProveedor(proveedorId: number): Promise<Turno[]> {
  return turnoRepository.findTurnosByProveedor(proveedorId);
}

export async function getTurnosByProveedorAndDia(proveedorId: number, dia: string): Promise<Turno[]> {
  const fecha = new Date(dia);
  if (isNaN(fecha.getTime())) throw new AppError("La fecha proporcionada no es valida", 400);
  return turnoRepository.findTurnosByProveedorAndDia(proveedorId, fecha);
}

export async function getFechasConTurnos(proveedorId: number): Promise<Date[]> {
  return turnoRepository.findFechasConTurnos(proveedorId);
}

export async function getTurnosByConsumidor(consumidorId: number): Promise<Turno[]> {
  return turnoRepository.findTurnosByConsumidor(consumidorId);
}

// PROVEEDOR crea turno con motivos
export async function createTurno(data: CreateTurnoInput): Promise<Turno> {
  const existente = await turnoRepository.findTurnoByDiaAndHora(data.dia, data.hora, data.proveedorId);
  if (existente) throw new AppError("Ya existe un turno para esa fecha y hora", 409);

  // Obtener o crear los motivos y obtener sus IDs
  let motivoIds: number[] = [];
  if (data.motivos && data.motivos.length > 0) {
    const motivos = await motivosService.getOrCreateMotivos(data.motivos, data.proveedorId);
    motivoIds = motivos.map(m => m.id);
  }

  return turnoRepository.createTurno(data, motivoIds);
}

export async function updateTurno(id: number, data: UpdateTurnoInput): Promise<Turno> {
  const turno = await turnoRepository.findTurnoById(id);
  if (!turno) throw new AppError("Turno no encontrado", 404);
  return turnoRepository.updateTurno(id, data);
}

// CONSUMIDOR agenda turno eligiendo un motivo
// Acepta consumidorId (logueado) O datos del consumidor (calendario publico, sin crear usuario)
export async function agendarTurno(
  turnoId: number,
  consumidorId: number | undefined,
  motivoSeleccionado?: string,
  consumidorData?: { nombre: string; apellidos: string; email: string; phone: string }
): Promise<Turno> {
  const turno = await turnoRepository.findTurnoById(turnoId);
  if (!turno) throw new AppError("Turno no encontrado", 404);
  if (turno.estado !== "DISPONIBLE") throw new AppError("Este turno ya no esta disponible", 400);

  // Calendario publico: usar los datos recibidos sin crear usuario
  if (consumidorData?.email) {
    const fullName = `${consumidorData.nombre} ${consumidorData.apellidos}`.trim();

    const turnoActualizado = await turnoRepository.updateTurno(turnoId, {
      estado: "POR_CONFIRMAR" as any,
      fullName,
      email: consumidorData.email,
      phone: consumidorData.phone,
      dni: "",
      ...(motivoSeleccionado && { motivoSeleccionado }),
    });

    const proveedor = await usuarioRepository.findUsuarioById(turno.proveedorId);
    if (proveedor && proveedor.email) {
      try {
        await emailService.enviarEmailTurnoAgendado(
          proveedor.email,
          getFullName(proveedor),
          fullName,
          { motivo: motivoSeleccionado || "Sin motivo", dia: new Date(turno.dia), hora: turno.hora }
        );
      } catch (error) {
        console.error("Error enviando email al proveedor:", error);
      }
    }

    return turnoActualizado;
  }

  // Usuario logueado: buscar por ID
  if (!consumidorId) throw new AppError("Se requiere consumidorId o datos del consumidor", 400);

  const consumidor = await usuarioRepository.findUsuarioById(consumidorId);
  if (!consumidor) throw new AppError("Consumidor no encontrado", 404);

  const turnoActualizado = await turnoRepository.updateTurno(turnoId, {
    estado: "POR_CONFIRMAR" as any,
    consumidorId: consumidorId,
    fullName: getFullName(consumidor),
    email: consumidor.email || "",
    phone: consumidor.phone || "",
    dni: "",
    ...(motivoSeleccionado && { motivoSeleccionado }),
  });

  const proveedor = await usuarioRepository.findUsuarioById(turno.proveedorId);
  if (proveedor && proveedor.email) {
    try {
      await emailService.enviarEmailTurnoAgendado(
        proveedor.email,
        getFullName(proveedor),
        getFullName(consumidor),
        { motivo: motivoSeleccionado || "Sin motivo", dia: new Date(turno.dia), hora: turno.hora }
      );
    } catch (error) {
      console.error("Error enviando email al proveedor:", error);
    }
  }

  return turnoActualizado;
}

export async function confirmarTurno(turnoId: number): Promise<Turno> {
  const turno = await turnoRepository.findTurnoById(turnoId);
  if (!turno) throw new AppError("Turno no encontrado", 404);
  if (turno.estado !== "POR_CONFIRMAR") throw new AppError("Solo se pueden confirmar turnos en estado POR_CONFIRMAR", 400);

  const turnoConfirmado = await turnoRepository.updateTurnoEstado(turnoId, "CONFIRMADO");

  if (turno.email) {
    try {
      const proveedor = await usuarioRepository.findUsuarioById(turno.proveedorId);
      await emailService.enviarEmailTurnoConfirmado(
        turno.email,
        turno.fullName || "Consumidor",
        getFullName(proveedor),
        { motivo: turno.motivoSeleccionado || "Sin motivo", dia: new Date(turno.dia), hora: turno.hora }
      );
    } catch (error) {
      console.error("Error enviando email al consumidor:", error);
    }
  }

  return turnoConfirmado;
}

export async function cancelarTurno(turnoId: number): Promise<Turno> {
  const turno = await turnoRepository.findTurnoById(turnoId);
  if (!turno) throw new AppError("Turno no encontrado", 404);
  if (turno.estado !== "POR_CONFIRMAR") throw new AppError("Solo se pueden cancelar turnos en estado POR_CONFIRMAR", 400);

  const turnoCancelado = await turnoRepository.updateTurnoEstado(turnoId, "CANCELADO");

  if (turno.email) {
    try {
      const proveedor = await usuarioRepository.findUsuarioById(turno.proveedorId);
      await emailService.enviarEmailTurnoCancelado(
        turno.email,
        turno.fullName || "Consumidor",
        getFullName(proveedor),
        { motivo: turno.motivoSeleccionado || "Sin motivo", dia: new Date(turno.dia), hora: turno.hora }
      );
    } catch (error) {
      console.error("Error enviando email al consumidor:", error);
    }
  }

  return turnoCancelado;
}

export async function deleteTurno(id: number): Promise<void> {
  const turno = await turnoRepository.findTurnoById(id);
  if (!turno) throw new AppError("Turno no encontrado", 404);
  await turnoRepository.deleteTurno(id);
}
