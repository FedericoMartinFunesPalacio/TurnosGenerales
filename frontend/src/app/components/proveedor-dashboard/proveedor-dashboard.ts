import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { animate, stagger } from 'animejs';
import { TurnosService } from '../../services/turnos.service';
import { MotivosService } from '../../services/motivos.service';
import { AuthService } from '../../services/auth.service';
import { Turno, Motivo } from '../../models/turno';
import { CardComponent } from '../card/card';
import { FormFieldComponent } from '../form-field/form-field';
import { ButtonComponent } from '../button/button';
import { ModalComponent } from '../modal/modal';
import { EstadoLabelPipe } from '../../pipes/estado-label.pipe';
import { enviroment } from '../../../env/enviroments';

@Component({
  selector: 'app-proveedor-dashboard',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule, MatIconModule,
    CardComponent, FormFieldComponent, ButtonComponent, ModalComponent,
    EstadoLabelPipe,
  ],
  templateUrl: './proveedor-dashboard.html',
  styleUrls: ['./proveedor-dashboard.css'],
})
  export class ProveedorDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('turnosList') turnosListRef!: ElementRef;

  turnoForm!: FormGroup;
  turnos: Turno[] = [];
  currentUser: any = null;

  formError = '';
  formSuccess = '';

  // Turnos modal
  showTurnosModal = false;
  isHistorial = false;

  // Detalle modal
  showDetailModal = false;
  selectedTurno: Turno | null = null;

  // Motivos tag input
  motivosFrecuentes: Motivo[] = [];
  motivosSeleccionados: string[] = [];
  motivoInput = '';
  showSuggestions = false;

  constructor(
    private fb: FormBuilder,
    private turnosService: TurnosService,
    private motivosService: MotivosService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    this.turnoForm = this.fb.group({
      dia: [''],
      hora: [''],
    });
    this.loadMotivos();
  }

  ngAfterViewInit(): void {}

  // ==========================================
  // MOTIVOS
  // ==========================================

  loadMotivos(): void {
    if (!this.currentUser) return;
    this.motivosService.getByProveedor(this.currentUser.id).subscribe({
      next: (data) => this.motivosFrecuentes = data,
    });
  }

  addMotivo(texto: string): void {
    const trimmed = texto.trim();
    if (trimmed.length < 2) return;
    if (this.motivosSeleccionados.includes(trimmed)) return;
    this.motivosSeleccionados.push(trimmed);
    this.motivoInput = '';
    this.showSuggestions = false;
  }

  removeMotivo(texto: string): void {
    this.motivosSeleccionados = this.motivosSeleccionados.filter(m => m !== texto);
  }

  onMotivoKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (this.motivoInput.trim()) {
        this.addMotivo(this.motivoInput);
      }
    }
    if (event.key === 'Backspace' && !this.motivoInput && this.motivosSeleccionados.length > 0) {
      this.motivosSeleccionados.pop();
    }
  }

  onMotivoBlur(): void {
    setTimeout(() => this.showSuggestions = false, 200);
  }

  getFilteredSuggestions(): Motivo[] {
    const term = this.motivoInput.toLowerCase().trim();
    return this.motivosFrecuentes.filter(m =>
      m.texto.toLowerCase().includes(term) && !this.motivosSeleccionados.includes(m.texto)
    );
  }

  // ==========================================
  // CREAR TURNO
  // ==========================================

  onCreateTurno(): void {
    this.formError = '';
    this.formSuccess = '';

    const f = this.turnoForm.value;

    if (f.dia) {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const partes = f.dia.split('-');
      const fechaSeleccionada = new Date(parseInt(partes[0]), parseInt(partes[1]) - 1, parseInt(partes[2]));
      if (fechaSeleccionada < hoy) {
        this.formError = 'La fecha no puede ser anterior a hoy';
        return;
      }
    } else { // if (!f.dia)
      this.formError = 'Debe seleccionar un día';
      return;
    }
    if (f.hora) {
      const horaParts = f.hora.split(':');
      const hora = parseInt(horaParts[0], 10);
      const minuto = parseInt(horaParts[1], 10);
      if (isNaN(hora) || isNaN(minuto) || hora < 0 || hora > 23 || minuto < 0 || minuto > 59) {
        this.formError = 'Debe ingresar una hora válida';
        return;
      }
    } else { // if (!f.hora)
      this.formError = 'Debe ingresar una hora válida';
      return;
    }

    if (this.motivosSeleccionados.length === 0) {
      this.formError = 'Debe agregar al menos un motivo al turno';
      return;
    }

    this.turnosService.create({
      dia: f.dia,
      hora: f.hora,
      proveedorId: this.currentUser!.id,
      motivos: this.motivosSeleccionados,
    }).subscribe({
      next: () => {
        this.formSuccess = 'Turno creado exitosamente';
        this.turnoForm.patchValue({ hora: '' });
        // No limpiar motivos para crear rapido
        setTimeout(() => this.formSuccess = '', 3000);
        this.loadMotivos();
      },
      error: (err) => { this.formError = err.error?.error || 'Error al crear turno'; },
    });
  }

  // ==========================================
  // MODAL TURNOS
  // ==========================================

  openTurnosModal(): void {
    this.isHistorial = false;
    this.showTurnosModal = true;
    this.loadTurnos();
  }

  openHistorial(): void {
    this.isHistorial = true;
    this.showTurnosModal = true;
    this.loadTurnos();
  }

  closeTurnosModal(): void {
    this.showTurnosModal = false;
    this.isHistorial = false;
  }

  loadTurnos(): void {
    if (!this.currentUser) return;
    this.turnosService.getByProveedor(this.currentUser.id).subscribe({
      next: (data) => {
        this.turnos = this.isHistorial
          ? data.filter(t => t.estado === 'CONFIRMADO' || t.estado === 'CANCELADO')
          : data.filter(t => t.estado === 'DISPONIBLE' || t.estado === 'POR_CONFIRMAR');
        setTimeout(() => this.animateTurnosList(), 50);
      },
    });
  }

  private animateTurnosList(): void {
    if (!this.turnosListRef) return;
    const items = this.turnosListRef.nativeElement.querySelectorAll('.turno-row');
    if (items.length === 0) return;
    animate(items, {
      opacity: [0, 1], translateX: [-10, 0], delay: stagger(50), duration: 300, easing: 'easeOutCubic',
    });
  }

  onConfirmar(turno: Turno): void {
    this.turnosService.confirmar(turno.id).subscribe({ next: () => this.loadTurnos() });
  }

  onCancelar(turno: Turno): void {
    this.turnosService.cancelar(turno.id).subscribe({ next: () => this.loadTurnos() });
  }

  onDelete(turno: Turno): void {
    this.turnosService.delete(turno.id).subscribe({ next: () => this.loadTurnos() });
  }

  // ==========================================
  // MODAL DETALLE
  // ==========================================

  openDetail(turno: Turno): void {
    this.selectedTurno = turno;
    this.showDetailModal = true;
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedTurno = null;
  }

  downloadDocumento(): void {
    if (!this.selectedTurno?.documentoUrl) return;
    // apiOrigin es "" en local (el proxy/nginx resuelve /uploads) y la
    // URL de Render en GitHub Pages.
    window.open(`${enviroment.apiOrigin}${this.selectedTurno.documentoUrl}`, '_blank');
  }

  formatDate(dateStr: string): string {
    const partes = dateStr.split('T')[0].split('-');
    const d = new Date(parseInt(partes[0]), parseInt(partes[1]) - 1, parseInt(partes[2]));
    return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  getEstadoBadge(estado: string): string {
    switch (estado) {
      case 'DISPONIBLE': return 'badge-neutral';
      case 'POR_CONFIRMAR': return 'badge-warning';
      case 'CONFIRMADO': return 'badge-success';
      case 'CANCELADO': return 'badge-error';
      default: return 'badge-neutral';
    }
  }

  getBorderLeft(estado: string): string {
    switch (estado) {
      case 'POR_CONFIRMAR': return '3px solid var(--state-warning)';
      case 'CONFIRMADO': return '3px solid var(--state-success)';
      case 'CANCELADO': return '3px solid var(--state-error)';
      default: return '3px solid var(--border-default)';
    }
  }

  getTurnoMotivos(turno: Turno): string {
    if (!turno.turnoMotivos || turno.turnoMotivos.length === 0) return 'Sin motivos';
    return turno.turnoMotivos.map(tm => tm.motivo.texto).join(', ');
  }
}
