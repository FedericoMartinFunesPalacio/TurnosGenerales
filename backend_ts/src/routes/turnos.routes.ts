// Rutas de Turnos
// Define los endpoints HTTP y que controller handler los maneja
import { Router } from "express";
import * as turnoController from "../controllers/turnos.controller.js";

const router = Router();

// ==========================================
// Rutas con prefijo (antes de /:id)
// Express evalua en orden, asi que las rutas con prefijo van primero
// ==========================================

// --- Proveedor ---
// GET /api/v1/turnos/proveedor/:proveedorId/fechas
router.get("/proveedor/:proveedorId/fechas", turnoController.getFechasConTurnos);

// GET /api/v1/turnos/proveedor/:proveedorId/fecha/:dia
router.get("/proveedor/:proveedorId/fecha/:dia", turnoController.getTurnosByProveedorAndDia);

// GET /api/v1/turnos/proveedor/:proveedorId
router.get("/proveedor/:proveedorId", turnoController.getTurnosByProveedor);

// --- Consumidor ---
// GET /api/v1/turnos/consumidor/:consumidorId
// Turnos de un consumidor (todos los estados) - para "Mis Turnos"
router.get("/consumidor/:consumidorId", turnoController.getTurnosByConsumidor);

// ==========================================
// CRUD basico
// ==========================================

// GET /api/v1/turnos
router.get("/", turnoController.getAllTurnos);

// GET /api/v1/turnos/:id
router.get("/:id", turnoController.getTurnoById);

// POST /api/v1/turnos
router.post("/", turnoController.createTurno);

// ==========================================
// Acciones de cambio de estado
// ==========================================

// PUT /api/v1/turnos/:id/agendar
// CONSUMIDOR agenda un turno DISPONIBLE → POR_CONFIRMAR
router.put("/:id/agendar", turnoController.agendarTurno);

// PUT /api/v1/turnos/:id/confirmar
// PROVEEDOR confirma un turno POR_CONFIRMAR → CONFIRMADO
router.put("/:id/confirmar", turnoController.confirmarTurno);

// PUT /api/v1/turnos/:id/cancelar
// PROVEEDOR cancela un turno POR_CONFIRMAR → CANCELADO
router.put("/:id/cancelar", turnoController.cancelarTurno);

// PUT /api/v1/turnos/:id
router.put("/:id", turnoController.updateTurno);

// DELETE /api/v1/turnos/:id
router.delete("/:id", turnoController.deleteTurno);

export default router;
