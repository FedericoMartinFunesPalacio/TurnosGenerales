// Controller de Motivos
import { Request, Response, NextFunction } from "express";
import * as motivosService from "../services/motivos.service.js";

// GET /api/v1/motivos/:proveedorId
export async function getMotivosByProveedor(req: Request, res: Response, next: NextFunction) {
  try {
    const proveedorId = parseInt(req.params.proveedorId as string, 10);
    if (isNaN(proveedorId)) { res.status(400).json({ error: "proveedorId debe ser un numero" }); return; }
    res.json(await motivosService.getMotivosByProveedor(proveedorId));
  } catch (error) { next(error); }
}

// POST /api/v1/motivos
export async function createMotivo(req: Request, res: Response, next: NextFunction) {
  try {
    const { texto, proveedorId } = req.body;
    res.status(201).json(await motivosService.createMotivo(texto, proveedorId));
  } catch (error) { next(error); }
}

// DELETE /api/v1/motivos/:id
export async function deleteMotivo(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.status(400).json({ error: "ID debe ser un numero" }); return; }
    await motivosService.deleteMotivo(id);
    res.status(204).send();
  } catch (error) { next(error); }
}
