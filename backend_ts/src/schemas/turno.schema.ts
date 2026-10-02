// Schemas de validacion para Turnos usando Zod
import { z } from "zod";

// ==========================================
// Schema para CREAR un turno (PROVEEDOR)
// Ahora incluye una lista de motivos (strings)
// ==========================================
export const createTurnoSchema = z.object({
  dia: z.coerce.date({
    message: "La fecha debe ser valida (formato ISO)",
  }),

  hora: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "La hora debe tener formato HH:mm (ej: 14:30)"),

  proveedorId: z.coerce.number().int().positive("El ID del proveedor debe ser un numero positivo"),

  // Lista de motivos que el proveedor asigna a este turno
  motivos: z.array(z.string().min(2).max(255)).optional(),
});

// ==========================================
// Schema para AGENDAR un turno (CONSUMIDOR)
// Puede recibir consumidorId (si ya esta logueado)
// o datos del consumidor (si viene del calendario publico)
// ==========================================
export const agendarTurnoSchema = z.object({
  consumidorId: z.number().int().positive("El ID del consumidor debe ser un numero positivo").optional(),
  nombre: z.string().min(2).max(100).optional(),
  apellidos: z.string().min(2).max(100).optional(),
  email: z.string().email("Email no valido").optional(),
  phone: z.string().min(8).max(20).optional(),
  motivoSeleccionado: z
    .string()
    .max(255, "El motivo no puede exceder 255 caracteres")
    .optional(),
});

// ==========================================
// Schema para ACTUALIZAR un turno (PATCH)
// ==========================================
export const updateTurnoSchema = z.object({
  dia: z.coerce.date().optional(),
  hora: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
  proveedorId: z.coerce.number().int().positive().optional(),
  estado: z.string().optional(),
  consumidorId: z.coerce.number().int().positive().optional(),
  motivoSeleccionado: z.string().optional(),
  fullName: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(8).max(20).optional(),
  dni: z.string().min(7).max(10).optional(),
  documentoUrl: z.string().optional(),
});

export type CreateTurnoInput = z.infer<typeof createTurnoSchema>;
export type UpdateTurnoInput = z.infer<typeof updateTurnoSchema>;
export type AgendarTurnoInput = z.infer<typeof agendarTurnoSchema>;
