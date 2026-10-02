import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { ConsumidorProveedoresComponent } from '../../components/consumidor-proveedores/consumidor-proveedores';
import { ConsumidorCalendarioComponent } from '../../components/consumidor-calendario/consumidor-calendario';
import { ConsumidorMisTurnosComponent } from '../../components/consumidor-mis-turnos/consumidor-mis-turnos';
import { NavbarComponent } from '../../components/navbar/navbar';

@Component({
  selector: 'app-consumidor',
  standalone: true,
  imports: [
    CommonModule, MatIconModule,
    ConsumidorProveedoresComponent, ConsumidorCalendarioComponent,
    ConsumidorMisTurnosComponent, NavbarComponent,
  ],
  templateUrl: './consumidor.html',
  styleUrls: ['./consumidor.css'],
})
export class ConsumidorPage implements OnInit {
  currentUser: any = null;
  currentView: 'proveedores' | 'calendario' | 'mis-turnos' = 'proveedores';
  selectedProveedorId = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    if (!this.currentUser) {
      this.router.navigate(['/login']);
    }
  }

  onSelectProveedor(proveedorId: number): void {
    this.selectedProveedorId = proveedorId;
    this.currentView = 'calendario';
  }

  onBackToProveedores(): void {
    this.currentView = 'proveedores';
  }

  goToMisTurnos(): void {
    this.currentView = 'mis-turnos';
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
