import { z } from "zod";

const rolesEnum = z.enum(["ADMIN", "CONSUMIDOR", "PROVEEDOR"]);

export const createUsuarioSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").max(100),
  apellidos: z.string().min(1, "Los apellidos son obligatorios").max(100),
  password: z.string().min(6, "La contrasena debe tener al menos 6 caracteres"),
  email: z.string().email("Debe ser un email valido"),
  phone: z.string().min(8, "El telefono debe tener al menos 8 caracteres").max(20),
  role: rolesEnum.default("CONSUMIDOR"),
});

export const loginUsuarioSchema = z.object({
  email: z.string().email("Debe ser un email valido"),
  password: z.string().min(1, "La contrasena es obligatoria"),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Debe ser un email valido"),
  newPassword: z.string().min(6, "La nueva contrasena debe tener al menos 6 caracteres"),
});

export type CreateUsuarioInput = z.infer<typeof createUsuarioSchema>;
export type LoginUsuarioInput = z.infer<typeof loginUsuarioSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
