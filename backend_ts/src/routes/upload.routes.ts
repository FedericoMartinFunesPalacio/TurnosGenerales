// Rutas de Upload
// Endpoints para subir archivos (documentos/fotos de turnos)
import { Router } from "express";
import { uploadMiddleware } from "../middlewares/upload.middleware.js";
import { uploadFile, uploadTurnoDocumento } from "../controllers/upload.controller.js";

const router = Router();

// POST /api/v1/upload
// Sube un archivo general. El middleware multer procesa el multipart/form-data
// single("file") = un solo archivo con campo "file" en el form
router.post("/", uploadMiddleware.single("file"), uploadFile);

// PUT /api/v1/upload/turno/:turnoId
// Sube un documento y lo asocia al turno (campo "documento" en el form)
router.put("/turno/:turnoId", uploadMiddleware.single("documento"), uploadTurnoDocumento);

export default router;
