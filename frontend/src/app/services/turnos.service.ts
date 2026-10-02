import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Turno, CreateTurnoRequest, AgendarTurnoRequest } from '../models/turno';
import { enviroment } from '../../env/enviroments';

@Injectable({ providedIn: 'root' })
export class TurnosService {
  private baseUrl = `${enviroment.apiBaseUrl}/turnos`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Turno[]> {
    return this.http.get<Turno[]>(this.baseUrl);
  }

  getById(id: number): Observable<Turno> {
    return this.http.get<Turno>(`${this.baseUrl}/${id}`);
  }

  getByProveedor(proveedorId: number): Observable<Turno[]> {
    return this.http.get<Turno[]>(`${this.baseUrl}/proveedor/${proveedorId}`);
  }

  getFechasConTurnos(proveedorId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/proveedor/${proveedorId}/fechas`);
  }

  getByProveedorAndFecha(proveedorId: number, dia: string): Observable<Turno[]> {
    return this.http.get<Turno[]>(`${this.baseUrl}/proveedor/${proveedorId}/fecha/${dia}`);
  }

  getByConsumidor(consumidorId: number): Observable<Turno[]> {
    return this.http.get<Turno[]>(`${this.baseUrl}/consumidor/${consumidorId}`);
  }

  create(data: CreateTurnoRequest): Observable<Turno> {
    return this.http.post<Turno>(this.baseUrl, data);
  }

  // CONSUMIDOR agenda un turno DISPONIBLE → POR_CONFIRMAR
  agendar(turnoId: number, data: AgendarTurnoRequest): Observable<Turno> {
    return this.http.put<Turno>(`${this.baseUrl}/${turnoId}/agendar`, data);
  }

  // PROVEEDOR confirma un turno POR_CONFIRMAR → CONFIRMADO
  confirmar(turnoId: number): Observable<Turno> {
    return this.http.put<Turno>(`${this.baseUrl}/${turnoId}/confirmar`, {});
  }

  // PROVEEDOR cancela un turno POR_CONFIRMAR → CANCELADO
  cancelar(turnoId: number): Observable<Turno> {
    return this.http.put<Turno>(`${this.baseUrl}/${turnoId}/cancelar`, {});
  }

  uploadDocumento(turnoId: number, formData: FormData): Observable<Turno> {
    return this.http.put<Turno>(`${enviroment.apiBaseUrl}/upload/turno/${turnoId}`, formData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
