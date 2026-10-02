import { Component, OnInit, HostListener, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class NavbarComponent implements OnInit {
  @Input() title = 'Turnos';
  @Input() showBack = false;
  @Input() backLabel = '';
  @Input() showShare = false;
  @Input() shareLabel = '';
  @Input() shareCopied = false;
  @Output() shareClicked = new EventEmitter<void>();

  currentUser: Usuario | null = null;
  dropdownOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private el: ElementRef,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
    }
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getRoleLabel(role: string): string {
    switch (role) {
      case 'PROVEEDOR': return 'Proveedor';
      case 'CONSUMIDOR': return 'Consumidor';
      default: return role;
    }
  }
}
