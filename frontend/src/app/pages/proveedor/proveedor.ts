import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { ProveedorDashboardComponent } from '../../components/proveedor-dashboard/proveedor-dashboard';
import { NavbarComponent } from '../../components/navbar/navbar';

@Component({
  selector: 'app-proveedor',
  standalone: true,
  imports: [CommonModule, MatIconModule, ProveedorDashboardComponent, NavbarComponent],
  templateUrl: './proveedor.html',
  styleUrls: ['./proveedor.css'],
})
export class ProveedorPage implements OnInit {
  @ViewChild('dashboard') dashboard?: ProveedorDashboardComponent;

  currentUser: any = null;
  linkCopied = false;

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

  copyShareLink(): void {
    // window.location.href sin la parte "#" es la URL base del sitio
    // (incluye /TurnosGenerales/ cuando corre en GitHub Pages).
    // Con hash location la ruta publica es base + #/calendario/<id>.
    const baseUrl = window.location.href.split('#')[0];
    const url = `${baseUrl}#/calendario/${this.currentUser.id}`;
    navigator.clipboard.writeText(url).then(() => {
      this.linkCopied = true;
      setTimeout(() => this.linkCopied = false, 2500);
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
