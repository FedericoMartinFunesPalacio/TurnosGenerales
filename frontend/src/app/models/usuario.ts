export type Rol = 'ADMIN' | 'CONSUMIDOR' | 'PROVEEDOR';

export interface Usuario {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  phone: string;
  role: Rol;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterRequest {
  nombre: string;
  apellidos: string;
  password: string;
  email: string;
  phone: string;
  role: Rol;
}

export interface LoginRequest {
  email: string;
  password: string;
}
