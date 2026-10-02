import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Usuario, LoginRequest, RegisterRequest } from '../models/usuario';
import { enviroment } from '../../env/enviroments';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const saved = sessionStorage.getItem('currentUser');
    if (saved) {
      this.currentUserSubject.next(JSON.parse(saved));
    }
  }

  login(credentials: LoginRequest): Observable<Usuario> {
    return this.http.put<Usuario>(`${enviroment.apiBaseUrl}/users/login`, credentials)
      .pipe(
        tap(user => {
          sessionStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        })
      );
  }

  register(data: RegisterRequest): Observable<Usuario> {
    return this.http.post<Usuario>(`${enviroment.apiBaseUrl}/users`, data)
      .pipe(
        tap(user => {
          sessionStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        })
      );
  }

  logout(): void {
    sessionStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  get currentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }
}
