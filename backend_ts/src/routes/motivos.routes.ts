// Rutas de Motivos
import { Router } from "express";
import * as motivosController from "../controllers/motivos.controller.js";

const router = Router();

// GET /api/v1/motivos/:proveedorId
router.get("/:proveedorId", motivosController.getMotivosByProveedor);

// POST /api/v1/motivos
router.post("/", motivosController.createMotivo);

// DELETE /api/v1/motivos/:id
router.delete("/:id", motivosController.deleteMotivo);

export default router;
