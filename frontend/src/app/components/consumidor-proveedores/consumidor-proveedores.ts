import { Component, OnInit, Output, EventEmitter, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { UsuariosService } from '../../services/usuarios.service';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/usuario';
import { animate, stagger } from 'animejs';

@Component({
  selector: 'app-consumidor-proveedores',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './consumidor-proveedores.html',
  styleUrls: ['./consumidor-proveedores.css'],
})
export class ConsumidorProveedoresComponent implements OnInit, AfterViewInit {
  @Output() proveedorSelected = new EventEmitter<number>();
  @ViewChild('grid') gridRef!: ElementRef;

  proveedores: Usuario[] = [];

  constructor(
    private usuariosService: UsuariosService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadProveedores();
  }

  ngAfterViewInit(): void {
    this.animateCards();
  }

  loadProveedores(): void {
    this.usuariosService.getByRole('PROVEEDOR').subscribe({
      next: (data) => {
        this.proveedores = data;
        this.animateCards();
      },
      error: (err) => console.error('Error:', err),
    });
  }

  selectProveedor(id: number): void {
    this.proveedorSelected.emit(id);
  }

  private animateCards(): void {
    if (!this.gridRef) return;
    animate(this.gridRef.nativeElement.querySelectorAll('.proveedor-card'), {
      opacity: [0, 1], translateY: [15, 0], delay: stagger(80), duration: 400, easing: 'easeOutCubic',
    });
  }
}
