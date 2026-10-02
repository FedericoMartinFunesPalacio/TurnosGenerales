import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Motivo } from '../models/turno';
import { enviroment } from '../../env/enviroments';

@Injectable({ providedIn: 'root' })
export class MotivosService {
  private baseUrl = `${enviroment.apiBaseUrl}/motivos`;

  constructor(private http: HttpClient) {}

  getByProveedor(proveedorId: number): Observable<Motivo[]> {
    return this.http.get<Motivo[]>(`${this.baseUrl}/${proveedorId}`);
  }

  create(texto: string, proveedorId: number): Observable<Motivo> {
    return this.http.post<Motivo>(this.baseUrl, { texto, proveedorId });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
