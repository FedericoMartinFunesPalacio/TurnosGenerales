import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TurnosService } from '../../services/turnos.service';
import { AuthService } from '../../services/auth.service';
import { Turno } from '../../models/turno';
import { ButtonComponent } from '../button/button';
import { ListComponent } from '../list/list';
import { EstadoLabelPipe } from '../../pipes/estado-label.pipe';
import { animate, stagger } from 'animejs';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-consumidor-mis-turnos',
  standalone: true,
  imports: [CommonModule, MatIconModule, ButtonComponent, ListComponent, EstadoLabelPipe],
  templateUrl: './consumidor-mis-turnos.html',
  styleUrls: ['./consumidor-mis-turnos.css'],
})
export class ConsumidorMisTurnosComponent implements OnInit, AfterViewInit {
  @ViewChild('listContainer') listRef!: ElementRef;

  currentUser: any = null;
  turnos: Turno[] = [];
  filteredTurnos: Turno[] = [];
  activeFilter = 'all';

  filters = [
    { value: 'all', label: 'Todos' },
    { value: 'POR_CONFIRMAR', label: 'Pendientes' },
    { value: 'CONFIRMADO', label: 'Confirmados' },
    { value: 'CANCELADO', label: 'Cancelados' },
  ];

  constructor(
    private turnosService: TurnosService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    this.loadTurnos();
  }

  ngAfterViewInit(): void {}

  loadTurnos(): void {
    if (!this.currentUser) return;
    this.turnosService.getByConsumidor(this.currentUser.id).subscribe({
      next: (data) => {
        this.turnos = data;
        this.filterTurnos();
        this.animateList();
      },
    });
  }

  filterTurnos(): void {
    this.filteredTurnos = this.activeFilter === 'all' ? this.turnos : this.turnos.filter(t => t.estado === this.activeFilter);
  }

  getCountByFilter(filter: string): number {
    return filter === 'all' ? this.turnos.length : this.turnos.filter(t => t.estado === filter).length;
  }

  private animateList(): void {
    if (!this.listRef) return;
    animate(this.listRef.nativeElement.querySelectorAll('.turno-item'), {
      opacity: [0, 1], translateX: [-10, 0], delay: stagger(50), duration: 300, easing: 'easeOutCubic',
    });
  }

  downloadComprobante(turno: Turno): void {
    const doc = new jsPDF();
    doc.setFillColor(15, 15, 15);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(229, 229, 229);
    doc.setFontSize(20);
    doc.text('COMPROBANTE DE TURNO', 105, 18, { align: 'center' });
    doc.setFontSize(10);
    doc.setTextColor(160, 160, 160);
    doc.text('Turnos App', 105, 28, { align: 'center' });

    const fields = [
      ['Estado:', this.formatEstado(turno.estado)],
      ['Motivo:', turno.motivoSeleccionado || '-'],
      ['Fecha:', this.formatDate(turno.dia)],
      ['Hora:', turno.hora],
      ['Consumidor:', turno.fullName || `${this.currentUser?.nombre} ${this.currentUser?.apellidos}` || '-'],
      ['DNI:', turno.dni || '-'],
      ['Email:', turno.email || this.currentUser?.email || '-'],
    ];

    let y = 55;
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(11);
    for (const [label, value] of fields) {
      doc.setFont('helvetica', 'bold');
      doc.text(label, 20, y);
      doc.setFont('helvetica', 'normal');
      doc.text(String(value), 60, y);
      y += 10;
    }

    doc.setDrawColor(200, 200, 200);
    doc.line(20, y + 5, 190, y + 5);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Comprobante generado automaticamente por Turnos App.', 105, y + 15, { align: 'center' });

    doc.save(`comprobante-turno-${turno.id}.pdf`);
  }

  formatEstado(estado: string): string {
    return ({ DISPONIBLE: 'Disponible', POR_CONFIRMAR: 'Pendiente', CONFIRMADO: 'Confirmado', CANCELADO: 'Cancelado' } as any)[estado] || estado;
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

  formatDate(dateStr: string): string {
    const partes = dateStr.split('T')[0].split('-');
    const d = new Date(parseInt(partes[0]), parseInt(partes[1]) - 1, parseInt(partes[2]));
    return d.toLocaleDateString('es-AR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  }
}
