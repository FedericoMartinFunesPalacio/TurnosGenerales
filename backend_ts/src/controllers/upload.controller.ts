// Controller de Upload
// Maneja la subida de archivos (documentos/fotos de turnos)
import { Request, Response, NextFunction } from "express";
import { updateTurno } from "../repositories/turnos.repository.js";

// POST /api/v1/upload
// Sube un archivo y retorna la URL para acceder a el
export function uploadFile(req: Request, res: Response, next: NextFunction) {
  try {
    // Multer agrega el archivo a req.file
    if (!req.file) {
      res.status(400).json({ error: "No se envio ningun archivo" });
      return;
    }

    // Construir la URL relativa del archivo subido
    // Ejemplo: /uploads/doc-1234567890-123456.jpg
    const fileUrl = `/uploads/${req.file.filename}`;

    res.json({
      message: "Archivo subido correctamente",
      url: fileUrl,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  } catch (error) {
    next(error);
  }
}

// PUT /api/v1/upload/turno/:turnoId
// Sube un documento y lo asocia al turno actualizando el campo documentoUrl
export async function uploadTurnoDocumento(req: Request, res: Response, next: NextFunction) {
  try {
    const turnoId = parseInt(req.params.turnoId as string);

    if (!req.file) {
      res.status(400).json({ error: "No se envio ningun archivo" });
      return;
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    // Actualizar el turno con la URL del documento usando el repository
    const turno = await updateTurno(turnoId, { documentoUrl: fileUrl });

    res.json({
      message: "Documento asociado al turno correctamente",
      turno,
      documentoUrl: fileUrl,
    });
  } catch (error) {
    next(error);
  }
}
