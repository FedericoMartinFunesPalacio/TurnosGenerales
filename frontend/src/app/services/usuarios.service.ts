// Servicio de Usuarios
// Maneja operaciones de usuarios contra el backend
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';
import { enviroment } from '../../env/enviroments';

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private baseUrl = `${enviroment.apiBaseUrl}/users`;

  constructor(private http: HttpClient) {}

  // Obtener todos los usuarios
  getAll(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.baseUrl);
  }

  // Obtener usuarios por rol (ej: listar proveedores)
  getByRole(role: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.baseUrl}/rol/${role}`);
  }

  // Obtener un usuario por ID
  getById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/${id}`);
  }
}
