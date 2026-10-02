// Modelos de Turno para el frontend

export interface Turno {
  id: number;
  dia: string;
  hora: string;
  estado: string;
  documentoUrl: string | null;
  proveedorId: number;
  consumidorId: number | null;
  motivoSeleccionado: string | null;
  fullName: string;
  email: string;
  phone: string;
  dni: string;
  createdAt: string;
  turnoMotivos: TurnoMotivo[];
}

export interface TurnoMotivo {
  id: number;
  turnoId: number;
  motivoId: number;
  motivo: Motivo;
}

export interface Motivo {
  id: number;
  texto: string;
  proveedorId: number;
  usageCount: number;
}

export interface CreateTurnoRequest {
  dia: string;
  hora: string;
  proveedorId: number;
  motivos?: string[];
}

export interface AgendarTurnoRequest {
  consumidorId?: number;
  nombre?: string;
  apellidos?: string;
  email?: string;
  phone?: string;
  motivoSeleccionado?: string;
}
