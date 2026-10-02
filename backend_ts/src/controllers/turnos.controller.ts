// Controller de Turnos
// Maneja las peticiones HTTP (req/res) y llama al Service
import { Request, Response, NextFunction } from "express";
import * as turnoService from "../services/turnos.service.js";
import {
  createTurnoSchema,
  updateTurnoSchema,
  agendarTurnoSchema,
} from "../schemas/turno.schema.js";

// ==========================================
// QUERIES (GET)
// ==========================================

// GET /api/v1/turnos
export async function getAllTurnos(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await turnoService.getAllTurnos());
  } catch (error) { next(error); }
}

// GET /api/v1/turnos/:id
export async function getTurnoById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.status(400).json({ error: "ID debe ser un numero" }); return; }
    res.json(await turnoService.getTurnoById(id));
  } catch (error) { next(error); }
}

// GET /api/v1/turnos/proveedor/:proveedorId
export async function getTurnosByProveedor(req: Request, res: Response, next: NextFunction) {
  try {
    const proveedorId = parseInt(req.params.proveedorId as string, 10);
    if (isNaN(proveedorId)) { res.status(400).json({ error: "proveedorId debe ser un numero" }); return; }
    res.json(await turnoService.getTurnosByProveedor(proveedorId));
  } catch (error) { next(error); }
}

// GET /api/v1/turnos/proveedor/:proveedorId/fecha/:dia
// Turnos DISPONIBLES de un proveedor en una fecha
export async function getTurnosByProveedorAndDia(req: Request, res: Response, next: NextFunction) {
  try {
    const proveedorId = parseInt(req.params.proveedorId as string, 10);
    const dia = req.params.dia as string;
    if (isNaN(proveedorId)) { res.status(400).json({ error: "proveedorId debe ser un numero" }); return; }
    res.json(await turnoService.getTurnosByProveedorAndDia(proveedorId, dia));
  } catch (error) { next(error); }
}

// GET /api/v1/turnos/proveedor/:proveedorId/fechas
// Fechas con turnos DISPONIBLES (para el calendario)
export async function getFechasConTurnos(req: Request, res: Response, next: NextFunction) {
  try {
    const proveedorId = parseInt(req.params.proveedorId as string, 10);
    if (isNaN(proveedorId)) { res.status(400).json({ error: "proveedorId debe ser un numero" }); return; }
    const fechas = await turnoService.getFechasConTurnos(proveedorId);
    res.json(fechas.map((f) => f.toISOString()));
  } catch (error) { next(error); }
}

// GET /api/v1/turnos/consumidor/:consumidorId
// Turnos de un consumidor (todos los estados) - para "Mis Turnos"
export async function getTurnosByConsumidor(req: Request, res: Response, next: NextFunction) {
  try {
    const consumidorId = parseInt(req.params.consumidorId as string, 10);
    if (isNaN(consumidorId)) { res.status(400).json({ error: "consumidorId debe ser un numero" }); return; }
    res.json(await turnoService.getTurnosByConsumidor(consumidorId));
  } catch (error) { next(error); }
}

// ==========================================
// ACCIONES (POST/PUT/DELETE)
// ==========================================

// POST /api/v1/turnos
// PROVEEDOR crea un turno DISPONIBLE
export async function createTurno(req: Request, res: Response, next: NextFunction) {
  try {
    const validatedData = createTurnoSchema.parse(req.body);
    res.status(201).json(await turnoService.createTurno(validatedData));
  } catch (error) { next(error); }
}

// PUT /api/v1/turnos/:id/agendar
// CONSUMIDOR agenda un turno DISPONIBLE → POR_CONFIRMAR
export async function agendarTurno(req: Request, res: Response, next: NextFunction) {
  try {
    const turnoId = parseInt(req.params.id as string, 10);
    if (isNaN(turnoId)) { res.status(400).json({ error: "ID debe ser un numero" }); return; }
    const validatedData = agendarTurnoSchema.parse(req.body);
    const consumidorData = validatedData.nombre && validatedData.email
      ? { nombre: validatedData.nombre, apellidos: validatedData.apellidos || '', email: validatedData.email, phone: validatedData.phone || '' }
      : undefined;
    res.json(await turnoService.agendarTurno(turnoId, validatedData.consumidorId, validatedData.motivoSeleccionado, consumidorData));
  } catch (error) { next(error); }
}

// PUT /api/v1/turnos/:id/confirmar
// PROVEEDOR confirma un turno POR_CONFIRMAR → CONFIRMADO
export async function confirmarTurno(req: Request, res: Response, next: NextFunction) {
  try {
    const turnoId = parseInt(req.params.id as string, 10);
    if (isNaN(turnoId)) { res.status(400).json({ error: "ID debe ser un numero" }); return; }
    res.json(await turnoService.confirmarTurno(turnoId));
  } catch (error) { next(error); }
}

// PUT /api/v1/turnos/:id/cancelar
// PROVEEDOR cancela un turno POR_CONFIRMAR → CANCELADO
export async function cancelarTurno(req: Request, res: Response, next: NextFunction) {
  try {
    const turnoId = parseInt(req.params.id as string, 10);
    if (isNaN(turnoId)) { res.status(400).json({ error: "ID debe ser un numero" }); return; }
    res.json(await turnoService.cancelarTurno(turnoId));
  } catch (error) { next(error); }
}

// PUT /api/v1/turnos/:id
export async function updateTurno(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.status(400).json({ error: "ID debe ser un numero" }); return; }
    const validatedData = updateTurnoSchema.parse(req.body);
    res.json(await turnoService.updateTurno(id, validatedData));
  } catch (error) { next(error); }
}

// DELETE /api/v1/turnos/:id
export async function deleteTurno(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.status(400).json({ error: "ID debe ser un numero" }); return; }
    await turnoService.deleteTurno(id);
    res.status(204).send();
  } catch (error) { next(error); }
}
