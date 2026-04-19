import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

function passwordValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.value;
  if (!password) return null;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const isLongEnough = password.length >= 8;
  if (!hasUpperCase || !hasNumber || !hasSpecialChar || !isLongEnough) {
    return { passwordStrength: true };
  }
  return null;
}

function passwordMatchValidator(
  control: AbstractControl,
): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  if (!password || !confirmPassword) return null;
  return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
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
        padding: 0.7rem 1rem 0.7rem 2.75rem;
        font-size: 0.875rem;
        outline: none;
        transition:
          border-color 0.18s,
          box-shadow 0.18s;
      }
      .form-input.no-icon {
        padding-left: 1rem;
      }
      .form-input::placeholder {
        color: #6060a0;
      }
      .form-input:focus {
        border-color: #f97316;
        box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.15);
      }
      .form-input.error-state {
        border-color: rgba(239, 68, 68, 0.5);
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.08);
      }

      input[type='date']::-webkit-calendar-picker-indicator {
        filter: invert(0.4) sepia(1) saturate(2) hue-rotate(10deg);
        cursor: pointer;
      }
    `,
  ],
  template: `
    <div
      class="min-h-screen flex items-start justify-center py-12 px-4 relative overflow-hidden"
      style="background:#0a0a14;"
    >
      <!-- Blobs -->
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
        class="card-enter relative w-full max-w-2xl rounded-3xl p-8 border"
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
          <span
            class="text-2xl font-black tracking-tight"
            style="background:linear-gradient(135deg,#fff 30%,#f97316);
                       -webkit-background-clip:text;-webkit-text-fill-color:transparent;"
          >
            RunZone
          </span>
          <p class="text-sm mt-1 font-medium" style="color:#6060a0;">
            Crea tu cuenta y empieza a correr
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

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
          <!-- ── Section: Personal info ──────────────────────────── -->
          <div>
            <p
              class="text-xs font-bold uppercase tracking-widest mb-4"
              style="color:#6060a0;"
            >
              Información personal
            </p>
            <div class="space-y-4">
              <!-- First + Last name -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    class="block text-xs font-bold uppercase tracking-widest mb-2"
                    style="color:#6060a0;"
                  >
                    Nombre
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
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <input
                      type="text"
                      formControlName="firstName"
                      placeholder="Ingrese su nombre"
                      [class]="
                        'form-input ' +
                        (form.get('firstName')?.invalid &&
                        form.get('firstName')?.touched
                          ? 'error-state'
                          : '')
                      "
                    />
                  </div>
                  @if (
                    form.get('firstName')?.hasError('required') &&
                    form.get('firstName')?.touched
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
                      Nombre es requerido
                    </p>
                  }
                </div>
                <div>
                  <label
                    class="block text-xs font-bold uppercase tracking-widest mb-2"
                    style="color:#6060a0;"
                  >
                    Apellido
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
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <input
                      type="text"
                      formControlName="lastName"
                      placeholder="Ingrese su apellido"
                      [class]="
                        'form-input ' +
                        (form.get('lastName')?.invalid &&
                        form.get('lastName')?.touched
                          ? 'error-state'
                          : '')
                      "
                    />
                  </div>
                  @if (
                    form.get('lastName')?.hasError('required') &&
                    form.get('lastName')?.touched
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
                      Apellido es requerido
                    </p>
                  }
                </div>
              </div>

              <!-- Email -->
              <div>
                <label
                  class="block text-xs font-bold uppercase tracking-widest mb-2"
                  style="color:#6060a0;"
                >
                  Correo Electrónico
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
                    placeholder="Ingrese su correo electrónico"
                    [class]="
                      'form-input ' +
                      (form.get('email')?.invalid && form.get('email')?.touched
                        ? 'error-state'
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
                    El correo electrónico es requerido
                  </p>
                }
                @if (
                  form.get('email')?.hasError('email') &&
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
                    Ingresa un correo electrónico válido
                  </p>
                }
              </div>

              <!-- Age + Birthdate -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label
                    class="block text-xs font-bold uppercase tracking-widest mb-2"
                    style="color:#6060a0;"
                  >
                    Edad
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
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path
                        d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
                      />
                    </svg>
                    <input
                      type="number"
                      formControlName="age"
                      placeholder="Ingrese su edad"
                      [class]="
                        'form-input ' +
                        (form.get('age')?.invalid && form.get('age')?.touched
                          ? 'error-state'
                          : '')
                      "
                    />
                  </div>
                  @if (
                    form.get('age')?.hasError('required') &&
                    form.get('age')?.touched
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
                      Edad requerida
                    </p>
                  }
                  @if (
                    form.get('age')?.hasError('min') && form.get('age')?.touched
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
                      Mínimo 18 años
                    </p>
                  }
                  @if (
                    form.get('age')?.hasError('max') && form.get('age')?.touched
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
                      Edad inválida
                    </p>
                  }
                </div>
                <div class="sm:col-span-2">
                  <label
                    class="block text-xs font-bold uppercase tracking-widest mb-2"
                    style="color:#6060a0;"
                  >
                    Fecha de nacimiento
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
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <input
                      type="date"
                      formControlName="birthDate"
                      [class]="
                        'form-input ' +
                        (form.get('birthDate')?.invalid &&
                        form.get('birthDate')?.touched
                          ? 'error-state'
                          : '')
                      "
                    />
                  </div>
                  @if (
                    form.get('birthDate')?.hasError('required') &&
                    form.get('birthDate')?.touched
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
                      Fecha de nacimiento requerida
                    </p>
                  }
                </div>
              </div>
            </div>
          </div>

          <!-- Divider -->
          <div class="h-px" style="background:#ffffff08;"></div>

          <!-- ── Section: Security ───────────────────────────────── -->
          <div>
            <p
              class="text-xs font-bold uppercase tracking-widest mb-4"
              style="color:#6060a0;"
            >
              Seguridad
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    placeholder="Ingrese una contraseña"
                    [class]="
                      'form-input pr-11 ' +
                      (form.get('password')?.invalid &&
                      form.get('password')?.touched
                        ? 'error-state'
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
                    [attr.aria-label]="showPassword() ? 'Ocultar' : 'Mostrar'"
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
                        <path
                          d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                        />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    }
                  </button>
                </div>
                <!-- Strength indicators -->
                @if (form.get('password')?.value) {
                  <div class="mt-2 space-y-1">
                    <div
                      class="flex items-center gap-2 text-xs"
                      [style]="
                        pwHasLength() ? 'color:#4ade80' : 'color:#6060a0'
                      "
                    >
                      <svg
                        class="w-3 h-3 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                        viewBox="0 0 24 24"
                      >
                        @if (pwHasLength()) {
                          <polyline points="20 6 9 17 4 12" />
                        } @else {
                          <circle
                            cx="12"
                            cy="12"
                            r="4"
                            fill="currentColor"
                            stroke="none"
                          />
                        }
                      </svg>
                      Mínimo 8 caracteres
                    </div>
                    <div
                      class="flex items-center gap-2 text-xs"
                      [style]="pwHasUpper() ? 'color:#4ade80' : 'color:#6060a0'"
                    >
                      <svg
                        class="w-3 h-3 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                        viewBox="0 0 24 24"
                      >
                        @if (pwHasUpper()) {
                          <polyline points="20 6 9 17 4 12" />
                        } @else {
                          <circle
                            cx="12"
                            cy="12"
                            r="4"
                            fill="currentColor"
                            stroke="none"
                          />
                        }
                      </svg>
                      Una mayúscula
                    </div>
                    <div
                      class="flex items-center gap-2 text-xs"
                      [style]="
                        pwHasNumber() ? 'color:#4ade80' : 'color:#6060a0'
                      "
                    >
                      <svg
                        class="w-3 h-3 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                        viewBox="0 0 24 24"
                      >
                        @if (pwHasNumber()) {
                          <polyline points="20 6 9 17 4 12" />
                        } @else {
                          <circle
                            cx="12"
                            cy="12"
                            r="4"
                            fill="currentColor"
                            stroke="none"
                          />
                        }
                      </svg>
                      Un número
                    </div>
                    <div
                      class="flex items-center gap-2 text-xs"
                      [style]="
                        pwHasSpecial() ? 'color:#4ade80' : 'color:#6060a0'
                      "
                    >
                      <svg
                        class="w-3 h-3 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                        viewBox="0 0 24 24"
                      >
                        @if (pwHasSpecial()) {
                          <polyline points="20 6 9 17 4 12" />
                        } @else {
                          <circle
                            cx="12"
                            cy="12"
                            r="4"
                            fill="currentColor"
                            stroke="none"
                          />
                        }
                      </svg>
                      Un carácter especial
                    </div>
                  </div>
                }
              </div>

              <!-- Confirm password -->
              <div>
                <label
                  class="block text-xs font-bold uppercase tracking-widest mb-2"
                  style="color:#6060a0;"
                >
                  Confirmar contraseña
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
                    [type]="showConfirm() ? 'text' : 'password'"
                    formControlName="confirmPassword"
                    placeholder="Confirme su contraseña"
                    [class]="
                      'form-input pr-11 ' +
                      ((form.get('confirmPassword')?.invalid &&
                        form.get('confirmPassword')?.touched) ||
                      (form.hasError('passwordMismatch') &&
                        form.get('confirmPassword')?.touched)
                        ? 'error-state'
                        : '')
                    "
                  />
                  <button
                    type="button"
                    (click)="toggleConfirm()"
                    class="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 rounded transition-colors"
                    style="color:#6060a0;background:transparent;"
                    onmouseenter="this.style.color='#f97316'"
                    onmouseleave="this.style.color='#6060a0'"
                    [attr.aria-label]="showConfirm() ? 'Ocultar' : 'Mostrar'"
                  >
                    @if (showConfirm()) {
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
                        <path
                          d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                        />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    }
                  </button>
                </div>
                @if (
                  form.get('confirmPassword')?.hasError('required') &&
                  form.get('confirmPassword')?.touched
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
                    Campo requerido
                  </p>
                }
                @if (
                  form.hasError('passwordMismatch') &&
                  form.get('confirmPassword')?.touched
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
                    Las contraseñas no coinciden
                  </p>
                }
              </div>
            </div>
          </div>

          <!-- Divider -->
          <div class="h-px" style="background:#ffffff08;"></div>

          <!-- ── Section: Location ───────────────────────────────── -->
          <div>
            <p
              class="text-xs font-bold uppercase tracking-widest mb-4"
              style="color:#6060a0;"
            >
              Ubicación y contacto
            </p>
            <div class="space-y-4">
              <!-- Country / State / City -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label
                    class="block text-xs font-bold uppercase tracking-widest mb-2"
                    style="color:#6060a0;"
                    >País</label
                  >
                  <div class="relative">
                    <svg
                      class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                      style="color:#6060a0;"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path
                        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
                      />
                    </svg>
                    <input
                      type="text"
                      formControlName="country"
                      placeholder="Ingrese su país"
                      [class]="
                        'form-input ' +
                        (form.get('country')?.invalid &&
                        form.get('country')?.touched
                          ? 'error-state'
                          : '')
                      "
                    />
                  </div>
                  @if (
                    form.get('country')?.hasError('required') &&
                    form.get('country')?.touched
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
                      Requerido
                    </p>
                  }
                </div>
                <div>
                  <label
                    class="block text-xs font-bold uppercase tracking-widest mb-2"
                    style="color:#6060a0;"
                    >Departamento</label
                  >
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
                        d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                      />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <input
                      type="text"
                      formControlName="state"
                      placeholder="Ingrese su departamento"
                      [class]="
                        'form-input ' +
                        (form.get('state')?.invalid &&
                        form.get('state')?.touched
                          ? 'error-state'
                          : '')
                      "
                    />
                  </div>
                  @if (
                    form.get('state')?.hasError('required') &&
                    form.get('state')?.touched
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
                      Requerido
                    </p>
                  }
                </div>
                <div>
                  <label
                    class="block text-xs font-bold uppercase tracking-widest mb-2"
                    style="color:#6060a0;"
                    >Ciudad</label
                  >
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
                        d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                      />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <input
                      type="text"
                      formControlName="city"
                      placeholder="Ingrese su ciudad"
                      [class]="
                        'form-input ' +
                        (form.get('city')?.invalid && form.get('city')?.touched
                          ? 'error-state'
                          : '')
                      "
                    />
                  </div>
                  @if (
                    form.get('city')?.hasError('required') &&
                    form.get('city')?.touched
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
                      Requerido
                    </p>
                  }
                </div>
              </div>

              <!-- Phone -->
              <div>
                <label
                  class="block text-xs font-bold uppercase tracking-widest mb-2"
                  style="color:#6060a0;"
                  >Celular</label
                >
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
                      d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.64 3.42 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 5.49 5.49l.96-.96a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"
                    />
                  </svg>
                  <input
                    type="tel"
                    formControlName="phone"
                    placeholder="Ingrese su numero"
                    [class]="
                      'form-input ' +
                      (form.get('phone')?.invalid && form.get('phone')?.touched
                        ? 'error-state'
                        : '')
                    "
                  />
                </div>
                @if (
                  form.get('phone')?.hasError('required') &&
                  form.get('phone')?.touched
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
                    Teléfono requerido
                  </p>
                }
              </div>

              <!-- Address -->
              <div>
                <label
                  class="block text-xs font-bold uppercase tracking-widest mb-2"
                  style="color:#6060a0;"
                  >Dirección</label
                >
                <div class="relative">
                  <svg
                    class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                    style="color:#6060a0;"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  <input
                    type="text"
                    formControlName="address"
                    placeholder="Ingrese su dirección"
                    [class]="
                      'form-input ' +
                      (form.get('address')?.invalid &&
                      form.get('address')?.touched
                        ? 'error-state'
                        : '')
                    "
                  />
                </div>
                @if (
                  form.get('address')?.hasError('required') &&
                  form.get('address')?.touched
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
                    Dirección requerida
                  </p>
                }
              </div>
            </div>
          </div>

          <!-- ── CTA ─────────────────────────────────────────────── -->
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
              Creando cuenta...
            } @else {
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                viewBox="0 0 24 24"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </svg>
              Crear cuenta
            }
          </button>
        </form>

        <!-- Divider -->
        <div class="flex items-center gap-3 my-6">
          <div class="flex-1 h-px" style="background:#ffffff08;"></div>
          <span class="text-xs font-bold" style="color:#6060a0;"
            >¿Ya tienes cuenta?</span
          >
          <div class="flex-1 h-px" style="background:#ffffff08;"></div>
        </div>

        <!-- Login link -->
        <a
          routerLink="/login"
          class="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl
                  font-bold text-sm border transition-all"
          style="border-color:#ffffff20;color:#a0a0c0;"
          onmouseenter="this.style.borderColor='rgba(249,115,22,0.4)';this.style.color='#f97316';this.style.background='rgba(249,115,22,0.06)'"
          onmouseleave="this.style.borderColor='#ffffff20';this.style.color='#a0a0c0';this.style.background='transparent'"
        >
          Iniciar sesión
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
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group(
    {
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, passwordValidator]],
      confirmPassword: ['', [Validators.required]],
      age: ['', [Validators.required, Validators.min(18), Validators.max(100)]],
      birthDate: ['', [Validators.required]],
      country: ['', [Validators.required, Validators.maxLength(50)]],
      state: ['', [Validators.required, Validators.maxLength(50)]],
      city: ['', [Validators.required, Validators.maxLength(50)]],
      phone: ['', [Validators.required, Validators.maxLength(20)]],
      address: ['', [Validators.required, Validators.maxLength(100)]],
    },
    { validators: passwordMatchValidator },
  );

  isLoading = signal(false);
  errorMessage = signal('');
  showPassword = signal(false);
  showConfirm = signal(false);

  get pwValue(): string {
    return this.form.get('password')?.value ?? '';
  }
  get pwHasLength(): () => boolean {
    return () => this.pwValue.length >= 8;
  }
  get pwHasUpper(): () => boolean {
    return () => /[A-Z]/.test(this.pwValue);
  }
  get pwHasNumber(): () => boolean {
    return () => /[0-9]/.test(this.pwValue);
  }
  get pwHasSpecial(): () => boolean {
    return () => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(this.pwValue);
  }

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }
  toggleConfirm(): void {
    this.showConfirm.update((v) => !v);
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    const v = this.form.value;
    const registerRequest = {
      firstName: v.firstName || '',
      lastName: v.lastName || '',
      email: v.email || '',
      password: v.password || '',
      age: Number(v.age),
      birthDate: v.birthDate || '',
      country: v.country || '',
      state: v.state || '',
      city: v.city || '',
      phone: v.phone || '',
      address: v.address || '',
    };

    this.authService.register(registerRequest).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/login'], {
          queryParams: { registered: 'true' },
        });
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.error?.message || 'Error al registrarse');
      },
    });
  }
}
