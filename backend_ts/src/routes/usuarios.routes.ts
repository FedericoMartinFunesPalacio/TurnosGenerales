// Rutas de Usuarios
// Define los endpoints para gestion de usuarios
import { Router } from "express";
import * as usuarioController from "../controllers/usuarios.controller.js";

const router = Router();

// GET /api/v1/users/rol/:role
// Obtener usuarios por rol - VA ANTES de /:id para que no lo capture
router.get("/rol/:role", usuarioController.getUsuariosByRole);

// GET /api/v1/users
router.get("/", usuarioController.getAllUsuarios);

// GET /api/v1/users/:id
router.get("/:id", usuarioController.getUsuarioById);

// POST /api/v1/users (registro)
router.post("/", usuarioController.createUsuario);

// PUT /api/v1/users/login
router.put("/login", usuarioController.loginUsuario);

// PUT /api/v1/users/reset
router.put("/reset", usuarioController.resetPassword);

export default router;
