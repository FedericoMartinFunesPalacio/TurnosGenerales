// Middleware global de manejo de errores
// En Express, un middleware de errores recibe 4 parametros: (err, req, res, next)
// Este middleware captura cualquier error no manejado y devuelve una respuesta estandarizada
import { Request, Response, NextFunction } from "express";

// Interfaz para errores customizados
// Permite agregar un codigo de status HTTP y un flag de si es un error conocido
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;  // Error controlado, no un bug inesperado
    // Preserve el nombre de la clase en el stack trace
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// Middleware de errores para Express
// Se registra CON app.use despues de todas las rutas para capturar errores de cualquier ruta
export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Log del error en consola para debugging
  console.error(`[Error] ${err.message}`);
  console.error(err.stack);

  // Si es un AppError (error conocido), usamos su status code
  // Si es un error desconocido, usamos 500 (Internal Server Error)
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || "Error interno del servidor";

  // Devolvemos respuesta JSON estandarizada
  res.status(statusCode).json({
    success: false,
    error: message,
    // En produccion NO se expone el stack trace por seguridad
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}
