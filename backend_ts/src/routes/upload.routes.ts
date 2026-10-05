// Rutas de Upload
// Endpoints para subir archivos (documentos/fotos de turnos),
// descargarlos via URL firmada y limpiar huérfanos del bucket
import { Router } from "express";
import { uploadMiddleware } from "../middlewares/upload.middleware.js";
import {
  uploadFile,
  uploadTurnoDocumento,
  getDocumento,
  cleanupDocumentos,
} from "../controllers/upload.controller.js";

const router = Router();

// POST /api/v1/upload
// Sube un archivo general. El middleware multer procesa el multipart/form-data
// single("file") = un solo archivo con campo "file" en el form
router.post("/", uploadMiddleware.single("file"), uploadFile);

// PUT /api/v1/upload/turno/:turnoId
// Sube un documento y lo asocia al turno (campo "documento" en el form)
router.put("/turno/:turnoId", uploadMiddleware.single("documento"), uploadTurnoDocumento);

// GET /api/v1/upload/documento/:filename
// Descarga: valida el nombre y responde 302 a una URL firmada de Supabase (5 min)
router.get("/documento/:filename", getDocumento);

// POST /api/v1/upload/cleanup?token=...&horas=24
// Borra del bucket los archivos que no referencia ningun turno (cron de GH Actions)
router.post("/cleanup", cleanupDocumentos);

export default router;
