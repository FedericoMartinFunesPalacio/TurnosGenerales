import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { CardComponent } from '../../components/card/card';
import { FormFieldComponent } from '../../components/form-field/form-field';
import { ButtonComponent } from '../../components/button/button';
import { AlertComponent } from '../../components/alert/alert';
import { animate } from 'animejs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatTabsModule, MatIconModule,
    CardComponent, FormFieldComponent, ButtonComponent, AlertComponent,
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild('container') containerRef!: ElementRef;

  loginForm!: FormGroup;
  registerForm!: FormGroup;
  loginError = '';
  registerError = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.redirectByRole();
    }

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      apellidos: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{8,15}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['CONSUMIDOR', Validators.required],
    });
  }

  ngAfterViewInit(): void {
    animate(this.containerRef.nativeElement.querySelector('.card'), {
      opacity: [0, 1], translateY: [30, 0], duration: 600, easing: 'easeOutCubic',
    });
  }

  onLogin(): void {
    this.loginError = '';
    this.authService.login(this.loginForm.value).subscribe({
      next: () => this.redirectByRole(),
      error: (err) => { this.loginError = err.error?.error || 'Credenciales invalidas'; },
    });
  }

  onRegister(): void {
    this.registerError = '';
    this.authService.register(this.registerForm.value).subscribe({
      next: () => this.redirectByRole(),
      error: (err) => { this.registerError = err.error?.error || 'Error al registrar'; },
    });
  }

  private redirectByRole(): void {
    const user = this.authService.currentUser;
    if (user?.role === 'PROVEEDOR') {
      this.router.navigate(['/proveedor']);
    } else {
      this.router.navigate(['/consumidor']);
    }
  }
}
