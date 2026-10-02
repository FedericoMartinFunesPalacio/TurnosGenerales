// Controller de Usuarios
// Maneja las peticiones HTTP para endpoints de usuarios
import { Request, Response, NextFunction } from "express";
import * as usuarioService from "../services/usuarios.service.js";
import {
  createUsuarioSchema,
  loginUsuarioSchema,
  resetPasswordSchema,
} from "../schemas/usuario.schema.js";

// ==========================================
// Handlers para cada endpoint de Usuarios
// ==========================================

// GET /api/v1/users
export async function getAllUsuarios(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const usuarios = await usuarioService.getAllUsuarios();
    res.json(usuarios);
  } catch (error) {
    next(error);
  }
}

// GET /api/v1/users/:id
export async function getUsuarioById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "ID debe ser un numero" });
      return;
    }

    const usuario = await usuarioService.getUsuarioById(id);
    res.json(usuario);
  } catch (error) {
    next(error);
  }
}

// POST /api/v1/users
// Crear un nuevo usuario (registro)
export async function createUsuario(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Validar body con schema de Zod
    const validatedData = createUsuarioSchema.parse(req.body);

    const usuario = await usuarioService.createUsuario(validatedData);
    res.status(201).json(usuario);
  } catch (error) {
    next(error);
  }
}

// PUT /api/v1/users/login
// Login de usuario - usa PUT porque es una accion sobre el recurso
export async function loginUsuario(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const validatedData = loginUsuarioSchema.parse(req.body);

    const usuario = await usuarioService.loginUsuario(validatedData);
    res.json(usuario);
  } catch (error) {
    next(error);
  }
}

// PUT /api/v1/users/reset
export async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const validatedData = resetPasswordSchema.parse(req.body);
    await usuarioService.resetPassword(validatedData);
    res.status(204).send();
  } catch (error) { next(error); }
}

// GET /api/v1/users/rol/:role
// Obtener usuarios por rol (ej: listar proveedores)
export async function getUsuariosByRole(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const role = req.params.role as string;
    const usuarios = await usuarioService.getUsuariosByRole(role);
    res.json(usuarios);
  } catch (error) { next(error); }
}
