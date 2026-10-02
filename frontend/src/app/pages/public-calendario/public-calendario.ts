import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TurnosService } from '../../services/turnos.service';
import { UsuariosService } from '../../services/usuarios.service';
import { Turno } from '../../models/turno';
import { CardComponent } from '../../components/card/card';
import { ButtonComponent } from '../../components/button/button';
import { AlertComponent } from '../../components/alert/alert';
import { ModalComponent } from '../../components/modal/modal';
import { animate, stagger } from 'animejs';

@Component({
  selector: 'app-public-calendario',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, CardComponent, ButtonComponent, AlertComponent, ModalComponent],
  templateUrl: './public-calendario.html',
  styleUrls: ['./public-calendario.css'],
})
export class PublicCalendarioComponent implements OnInit, AfterViewInit {
  @ViewChild('turnosSlot') turnosRef!: ElementRef;

  proveedorId = 0;
  proveedorNombre = '';
  currentMonth = new Date().getMonth();
  currentYear = new Date().getFullYear();
  weekDays = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
  calendarDays: { date: Date; dayNumber: number; inMonth: boolean; hasTurnos: boolean }[] = [];
  fechasConTurnos: string[] = [];

  showSlotModal = false;
  selectedDate: Date | null = null;
  availableTurnos: Turno[] = [];

  showBookingModal = false;
  selectedTurno: Turno | null = null;
  agendarError = '';
  agendarSuccess = false;

  // Formulario de booking (sin usuario logueado, pide todos los datos)
  bookingNombre = '';
  bookingApellidos = '';
  bookingEmail = '';
  bookingPhone = '';
  bookingDni = '';
  bookingMotivosSeleccionados: string[] = [];
  bookingDocumento: File | null = null;
  bookingDocumentoName = '';
  isBooking = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private turnosService: TurnosService,
    private usuariosService: UsuariosService,
  ) {}

  ngOnInit(): void {
    this.proveedorId = Number(this.route.snapshot.paramMap.get('proveedorId'));
    this.loadProveedor();
    this.loadFechasConTurnos();
    this.buildCalendar();
  }

  ngAfterViewInit(): void {}

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  loadProveedor(): void {
    this.usuariosService.getById(this.proveedorId).subscribe({
      next: (u) => { this.proveedorNombre = `${u.nombre} ${u.apellidos}`; },
      error: () => { this.proveedorNombre = 'Profesional'; },
    });
  }

  loadFechasConTurnos(): void {
    this.turnosService.getFechasConTurnos(this.proveedorId).subscribe({
      next: (fechas) => {
        this.fechasConTurnos = fechas.map(f => f.split('T')[0]);
        this.buildCalendar();
      },
    });
  }

  buildCalendar(): void {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const startOffset = firstDay.getDay();
    this.calendarDays = [];

    const prevMonthLast = new Date(this.currentYear, this.currentMonth, 0);
    for (let i = startOffset - 1; i >= 0; i--) {
      this.calendarDays.push({ date: new Date(), dayNumber: prevMonthLast.getDate() - i, inMonth: false, hasTurnos: false });
    }
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(this.currentYear, this.currentMonth, d);
      this.calendarDays.push({ date, dayNumber: d, inMonth: true, hasTurnos: this.fechasConTurnos.includes(this.toDateString(date)) });
    }
    const remaining = 42 - this.calendarDays.length;
    for (let d = 1; d <= remaining; d++) {
      this.calendarDays.push({ date: new Date(), dayNumber: d, inMonth: false, hasTurnos: false });
    }
  }

  prevMonth(): void { this.currentMonth--; if (this.currentMonth < 0) { this.currentMonth = 11; this.currentYear--; } this.buildCalendar(); }
  nextMonth(): void { this.currentMonth++; if (this.currentMonth > 11) { this.currentMonth = 0; this.currentYear++; } this.buildCalendar(); }

  selectDay(day: { date: Date; inMonth: boolean }): void {
    if (!day.inMonth) return;
    this.selectedDate = day.date;
    this.selectedTurno = null;
    this.agendarSuccess = false;
    this.agendarError = '';

    this.turnosService.getByProveedorAndFecha(this.proveedorId, this.toDateString(day.date)).subscribe({
      next: (turnos) => {
        this.availableTurnos = turnos;
        this.showSlotModal = true;
        setTimeout(() => this.animateTurnos(), 50);
      },
    });
  }

  private animateTurnos(): void {
    if (!this.turnosRef) return;
    animate(this.turnosRef.nativeElement.querySelectorAll('.turno-slot'), {
      opacity: [0, 1], scale: [0.9, 1], delay: stagger(60), duration: 300, easing: 'easeOutCubic',
    });
  }

  selectTurno(turno: Turno): void {
    this.selectedTurno = turno;
    this.showSlotModal = false;
    this.agendarError = '';
    this.bookingMotivosSeleccionados = [];
    this.bookingDocumento = null;
    this.bookingDocumentoName = '';
    this.showBookingModal = true;
  }

  closeSlotModal(): void {
    this.showSlotModal = false;
    this.selectedDate = null;
    this.availableTurnos = [];
  }

  closeBookingModal(): void {
    this.showBookingModal = false;
    this.selectedTurno = null;
  }

  backToSlots(): void {
    this.showBookingModal = false;
    this.selectedTurno = null;
    this.showSlotModal = true;
  }

  getTurnoMotivos(): string[] {
    if (!this.selectedTurno?.turnoMotivos) return [];
    return this.selectedTurno.turnoMotivos.map(tm => tm.motivo.texto);
  }

  toggleMotivo(motivo: string): void {
    const idx = this.bookingMotivosSeleccionados.indexOf(motivo);
    if (idx === -1) {
      this.bookingMotivosSeleccionados.push(motivo);
    } else {
      this.bookingMotivosSeleccionados.splice(idx, 1);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.size > 5 * 1024 * 1024) {
        this.agendarError = 'El archivo no puede superar 5MB';
        return;
      }
      this.bookingDocumento = file;
      this.bookingDocumentoName = file.name;
      this.agendarError = '';
    }
  }

  removeFile(): void {
    this.bookingDocumento = null;
    this.bookingDocumentoName = '';
  }

  // Agendar: envia datos del consumidor directamente al backend
  onAgendar(): void {
    if (!this.selectedTurno) return;

    // Validaciones basicas
    if (!this.bookingNombre.trim() || !this.bookingApellidos.trim() || !this.bookingEmail.trim() || !this.bookingPhone.trim()) {
      this.agendarError = 'Nombre, apellidos, email y telefono son obligatorios';
      return;
    }

    this.isBooking = true;
    this.agendarError = '';

    const payload: any = {
      nombre: this.bookingNombre.trim(),
      apellidos: this.bookingApellidos.trim(),
      email: this.bookingEmail.trim(),
      phone: this.bookingPhone.trim(),
    };
    if (this.bookingMotivosSeleccionados.length > 0) {
      payload.motivoSeleccionado = this.bookingMotivosSeleccionados.join(', ');
    }

    this.turnosService.agendar(this.selectedTurno.id, payload).subscribe({
      next: (turnoAgendado) => {
        if (this.bookingDocumento) {
          const formData = new FormData();
          formData.append('documento', this.bookingDocumento);
          this.turnosService.uploadDocumento(turnoAgendado.id, formData).subscribe({
            next: () => this.onBookingSuccess(),
            error: () => this.onBookingSuccess(),
          });
        } else {
          this.onBookingSuccess();
        }
      },
      error: (err) => {
        this.isBooking = false;
        this.agendarError = err.error?.error || 'Error al agendar turno';
      },
    });
  }

  private onBookingSuccess(): void {
    this.isBooking = false;
    this.showBookingModal = false;
    this.selectedTurno = null;
    this.selectedDate = null;
    this.availableTurnos = [];
    this.agendarSuccess = true;
    this.loadFechasConTurnos();
    setTimeout(() => this.agendarSuccess = false, 5000);
  }

  getMonthName(): string {
    return ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'][this.currentMonth];
  }

  formatSelectedDate(): string {
    if (!this.selectedDate) return '';
    return this.selectedDate.toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' });
  }

  isToday(day: { date: Date }): boolean { return this.toDateString(day.date) === this.toDateString(new Date()); }

  getDayBg(day: { date: Date; inMonth: boolean; hasTurnos: boolean }): string {
    if (!day.inMonth) return 'transparent';
    if (this.selectedDate && this.toDateString(day.date) === this.toDateString(this.selectedDate)) return 'var(--text-primary)';
    if (day.hasTurnos) return 'var(--state-success)';
    return 'transparent';
  }

  getDayColor(day: { date: Date; inMonth: boolean; hasTurnos: boolean }): string {
    if (!day.inMonth) return 'var(--text-disabled)';
    if (this.selectedDate && this.toDateString(day.date) === this.toDateString(this.selectedDate)) return 'var(--text-inverse)';
    if (day.hasTurnos) return 'var(--state-success-text)';
    return 'var(--text-primary)';
  }

  private toDateString(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
}
