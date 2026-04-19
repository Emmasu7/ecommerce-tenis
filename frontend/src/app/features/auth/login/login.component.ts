import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  styles: [
    `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(24px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .card-enter {
        animation: fadeInUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
      }

      .btn-primary {
        background: linear-gradient(135deg, #f97316 0%, #ef4444 100%);
        transition:
          filter 0.2s,
          transform 0.15s,
          box-shadow 0.2s;
      }
      .btn-primary:hover:not(:disabled) {
        filter: brightness(1.1);
        transform: translateY(-1px);
        box-shadow: 0 8px 28px rgba(249, 115, 22, 0.4);
      }
      .btn-primary:active:not(:disabled) {
        transform: translateY(0);
      }
      .btn-primary:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }

      .form-input {
        width: 100%;
        background: #0a0a14;
        border: 1px solid #ffffff15;
        color: #e2e2f0;
        border-radius: 0.75rem;
        padding: 0.75rem 1rem 0.75rem 2.75rem;
        font-size: 0.875rem;
        outline: none;
        transition:
          border-color 0.18s,
          box-shadow 0.18s;
      }
      .form-input::placeholder {
        color: #6060a0;
      }
      .form-input:focus {
        border-color: #f97316;
        box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.15);
      }
      .form-input.error {
        border-color: rgba(239, 68, 68, 0.5);
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.08);
      }
    `,
  ],
  template: `
    <div
      class="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden"
      style="background:#0a0a14;"
    >
      <!-- Decorative blobs -->
      <div
        class="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-15 pointer-events-none"
        style="background:radial-gradient(circle,#f97316,transparent 70%);"
      ></div>
      <div
        class="absolute -bottom-24 -left-24 w-72 h-72 rounded-full opacity-10 pointer-events-none"
        style="background:radial-gradient(circle,#ef4444,transparent 70%);"
      ></div>

      <!-- Card -->
      <div
        class="card-enter relative w-full max-w-md rounded-3xl p-8 border"
        style="background:#11111e;border-color:#ffffff0d;
                  box-shadow:0 24px 64px rgba(0,0,0,0.5),0 0 0 1px rgba(249,115,22,0.04);"
      >
        <!-- Logo -->
        <div class="flex flex-col items-center mb-8">
          <div
            class="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
            style="background:linear-gradient(135deg,#f97316,#ef4444);"
          >
            <svg
              width="38"
              height="38"
              viewBox="0 0 38 38"
              fill="none"
              aria-hidden="true"
            >
              <rect width="38" height="38" rx="12" fill="#f97316" />
              <text
                x="9"
                y="27"
                font-family="Arial Black, sans-serif"
                font-size="22"
                font-weight="900"
                fill="white"
              >
                R
              </text>
              <path
                d="M6 30 Q20 24 32 27"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                fill="none"
                opacity="0.6"
              />
            </svg>
          </div>
          <span class="text-lg font-black tracking-tight text-white">
            RunZone
          </span>
          <p class="text-sm mt-1 font-medium" style="color:#6060a0;">
            Accede a tu cuenta
          </p>
        </div>

        <!-- Error banner -->
        @if (errorMessage()) {
          <div
            class="flex items-center gap-3 px-4 py-3.5 rounded-xl mb-5 border"
            style="background:rgba(239,68,68,0.08);border-color:rgba(239,68,68,0.3);color:#f87171;"
          >
            <svg
              class="w-4 h-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span class="text-sm font-semibold">{{ errorMessage() }}</span>
          </div>
        }

        <!-- Form -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-5">
          <!-- Email -->
          <div>
            <label
              class="block text-xs font-bold uppercase tracking-widest mb-2"
              style="color:#6060a0;"
            >
              Correo Electronico
            </label>
            <div class="relative">
              <svg
                class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style="color:#6060a0;"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <input
                type="email"
                formControlName="email"
                placeholder="tu@email.com"
                [class]="
                  'form-input pl-10 ' +
                  (form.get('email')?.invalid && form.get('email')?.touched
                    ? 'error'
                    : '')
                "
              />
            </div>
            @if (
              form.get('email')?.hasError('required') &&
              form.get('email')?.touched
            ) {
              <p
                class="flex items-center gap-1.5 text-xs mt-1.5"
                style="color:#f87171;"
              >
                <svg
                  class="w-3 h-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
                El email es requerido
              </p>
            }
            @if (
              form.get('email')?.hasError('email') && form.get('email')?.touched
            ) {
              <p
                class="flex items-center gap-1.5 text-xs mt-1.5"
                style="color:#f87171;"
              >
                <svg
                  class="w-3 h-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
                Ingresa un email válido
              </p>
            }
          </div>

          <!-- Password -->
          <div>
            <label
              class="block text-xs font-bold uppercase tracking-widest mb-2"
              style="color:#6060a0;"
            >
              Contraseña
            </label>
            <div class="relative">
              <svg
                class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style="color:#6060a0;"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                [type]="showPassword() ? 'text' : 'password'"
                formControlName="password"
                placeholder="••••••••"
                [class]="
                  'form-input pl-10 pr-11 ' +
                  (form.get('password')?.invalid &&
                  form.get('password')?.touched
                    ? 'error'
                    : '')
                "
              />
              <button
                type="button"
                (click)="togglePassword()"
                class="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 rounded transition-colors"
                style="color:#6060a0;background:transparent;"
                onmouseenter="this.style.color='#f97316'"
                onmouseleave="this.style.color='#6060a0'"
                [attr.aria-label]="
                  showPassword() ? 'Ocultar contraseña' : 'Mostrar contraseña'
                "
              >
                @if (showPassword()) {
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"
                    />
                    <path
                      d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"
                    />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                } @else {
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                }
              </button>
            </div>
            @if (
              form.get('password')?.hasError('required') &&
              form.get('password')?.touched
            ) {
              <p
                class="flex items-center gap-1.5 text-xs mt-1.5"
                style="color:#f87171;"
              >
                <svg
                  class="w-3 h-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
                La contraseña es requerida
              </p>
            }
          </div>

          <!-- Submit -->
          <button
            type="submit"
            [disabled]="isLoading()"
            class="btn-primary w-full flex items-center justify-center gap-2.5
                         py-3.5 rounded-2xl font-black text-white text-sm mt-2"
          >
            @if (isLoading()) {
              <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-dasharray="32"
                  stroke-dashoffset="12"
                />
              </svg>
              Iniciando sesión...
            } @else {
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                viewBox="0 0 24 24"
              >
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              Iniciar sesión
            }
          </button>
        </form>

        <!-- Divider -->
        <div class="flex items-center gap-3 my-6">
          <div class="flex-1 h-px" style="background:#ffffff08;"></div>
          <span class="text-xs font-bold" style="color:#6060a0;"
            >¿Nuevo aquí?</span
          >
          <div class="flex-1 h-px" style="background:#ffffff08;"></div>
        </div>

        <!-- Register link -->
        <a
          routerLink="/register"
          class="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl
                  font-bold text-sm border transition-all"
          style="border-color:#ffffff20;color:#a0a0c0;"
          onmouseenter="this.style.borderColor='rgba(249,115,22,0.4)';this.style.color='#f97316';this.style.background='rgba(249,115,22,0.06)'"
          onmouseleave="this.style.borderColor='#ffffff20';this.style.color='#a0a0c0';this.style.background='transparent'"
        >
          Crear una cuenta
          <svg
            class="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            viewBox="0 0 24 24"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  isLoading = signal(false);
  errorMessage = signal('');
  showPassword = signal(false);

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.login(this.form.getRawValue() as LoginRequest).subscribe({
      next: () => {
        this.isLoading.set(false);
        const role = this.authService.currentUser()?.role;
        if (role === 'Admin') {
          this.router.navigate(['/admin/products']);
        } else {
          this.router.navigate(['/catalog']);
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          error.error?.message || 'Error al iniciar sesión',
        );
      },
    });
  }
}
