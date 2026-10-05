// Controller de Upload / Documentos
// Maneja la subida de archivos (documentos/fotos de turnos),
// la descarga via URL firmada y el cleanup de archivos huérfanos.
//
// Flujo completo:
//   1. Multer (memory) deja el archivo en req.file.buffer
//   2. Se sube al bucket PRIVADO de Supabase Storage
//   3. En la DB se guarda la ruta interna: /api/v1/upload/documento/<key>
//   4. El FE abre esa ruta → GET /documento/<key> → 302 → URL firmada (5 min)
import { Request, Response, NextFunction } from "express";
import {
  updateTurno,
  findTurnoById,
  findAllDocumentoUrls,
} from "../repositories/turnos.repository.js";
import * as storageService from "../services/storage.service.js";
import { AppError } from "../middlewares/error.handler.js";

// URL que guardamos en la DB.
// El FE hace window.open(apiOrigin + documentoUrl) y el backend la resuelve
// con un 302 a la URL firmada de Supabase. Asi el frontend NO cambia nada.
function armarUrlDocumento(nombre: string): string {
  return `/api/v1/upload/documento/${nombre}`;
}

// POST /api/v1/upload
// Sube un archivo general. Retorna la URL interna para acceder a el
export async function uploadFile(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No se envio ningun archivo" });
      return;
    }

    const nombre = storageService.generarNombreArchivo(req.file.mimetype);
    await storageService.subirDocumento(req.file.buffer, nombre, req.file.mimetype);

    res.json({
      message: "Archivo subido correctamente",
      url: armarUrlDocumento(nombre),
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

    // Validamos el turno ANTES de subir: si no existe, no subimos nada
    // (evita dejar archivos huérfanos en el bucket)
    const turnoActual = await findTurnoById(turnoId);
    if (!turnoActual) throw new AppError("Turno no encontrado", 404);

    // 1. Subir el archivo nuevo al bucket
    const nombre = storageService.generarNombreArchivo(req.file.mimetype);
    await storageService.subirDocumento(req.file.buffer, nombre, req.file.mimetype);

    // 2. Registrar la referencia en la DB
    let turno;
    try {
      turno = await updateTurno(turnoId, { documentoUrl: armarUrlDocumento(nombre) });
    } catch (dbError) {
      // Si la DB falla, borramos el archivo recien subido para no dejar huérfano
      await storageService.eliminarDocumento(nombre).catch(() => {});
      throw dbError;
    }

    // 3. Si habia un documento anterior, borramos el objeto viejo del bucket.
    //    best-effort: si falla, el cleanup diario lo retira igual.
    const urlVieja = turnoActual.documentoUrl;
    if (urlVieja) {
      const nombreViejo = storageService.extraerNombreArchivo(urlVieja);
      if (nombreViejo && nombreViejo !== nombre) {
        await storageService
          .eliminarDocumento(nombreViejo)
          .catch((e) => console.error("No se pudo borrar el documento anterior:", e));
      }
    }

    res.json({
      message: "Documento asociado al turno correctamente",
      turno,
      documentoUrl: armarUrlDocumento(nombre),
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/v1/upload/documento/:filename
// El FE abre esta ruta → validamos el nombre → 302 a la URL firmada de Supabase
export async function getDocumento(req: Request, res: Response, next: NextFunction) {
  try {
    const nombre = req.params.filename as string;

    // Solo aceptamos nombres que generamos NOSOTROS (doc-<ts>-<rand>.<ext>).
    // Rechaza path traversal (../../etc/passwd) y cualquier nombre arbitrario.
    if (!/^doc-\d+-\d+\.(jpg|png|webp|pdf)$/i.test(nombre)) {
      res.status(400).json({ error: "Nombre de archivo invalido" });
      return;
    }

    const signedUrl = await storageService.firmarDocumento(nombre);
    // 302: el browser sigue la cadena hasta el archivo en Supabase
    res.redirect(signedUrl);
  } catch (error) {
    next(error);
  }
}

// POST /api/v1/upload/cleanup?token=...&horas=24
// Borra archivos del bucket que NO referencia ningun turno y que ademas
// tienen mas de "horas" (default 24) de creados.
// El margen de edad evita borrar una subida que esta "en vuelo" (recien
// subida a Supabase pero todavia no registrada en la DB).
// Lo invoca el cron diario de GitHub Actions (.github/workflows/cleanup-documentos.yml)
export async function cleanupDocumentos(req: Request, res: Response, next: NextFunction) {
  try {
    // Autenticacion simple: secreto compartido via query param
    const token = req.query.token;
    const esperado = process.env.CLEANUP_TOKEN;
    if (!esperado || !token || token !== esperado) {
      throw new AppError("Token invalido", 401);
    }

    const horas = Number(req.query.horas ?? 24);
    if (!Number.isFinite(horas) || horas < 0) {
      throw new AppError("Parametro horas invalido", 400);
    }

    // 1. Keys que SÍ estan referenciadas en la DB
    const referenciadas = new Set(
      (await findAllDocumentoUrls()).map((u) => storageService.extraerNombreArchivo(u))
    );

    // 2. Listar todo el bucket
    const archivos = await storageService.listarDocumentos();

    // 3. Borrar los que no estan referenciados y ya pasaron el margen de edad
    const corte = Date.now() - horas * 3600 * 1000;
    const eliminados: string[] = [];
    for (const archivo of archivos) {
      if (referenciadas.has(archivo.nombre)) continue;          // referenciado → intocable
      if (new Date(archivo.creadoEn).getTime() > corte) continue; // muy reciente → esperamos
      await storageService.eliminarDocumento(archivo.nombre);
      eliminados.push(archivo.nombre);
    }

    res.json({
      message: "Cleanup ejecutado",
      horasMinimas: horas,
      escaneados: archivos.length,
      referenciados: referenciadas.size,
      eliminados: eliminados.length,
      archivos: eliminados,
    });
  } catch (error) {
    next(error);
  }
}
