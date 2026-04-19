import { Component, inject, signal, computed, effect} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { PRODUCT_SIZE_MAP, PRODUCT_COLOR_MAP } from '../../../core/models';

const SIZE_REVERSE: Record<string, string> = {
  '7': 'S7',
  '8': 'S8',
  '9': 'S9',
  '10': 'S10',
};

@Component({
  selector: 'app-admin-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  styles: [
    `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes shimmer {
        0% {
          background-position: -200% 0;
        }
        100% {
          background-position: 200% 0;
        }
      }
      @keyframes progressFill {
        from {
          width: 0;
        }
      }

      .card-enter {
        animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
      }

      .skeleton-shimmer {
        background: linear-gradient(
          90deg,
          #1e1e2e 25%,
          #2a2a3e 50%,
          #1e1e2e 75%
        );
        background-size: 200% 100%;
        animation: shimmer 1.5s ease-in-out infinite;
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
        display: block;
        width: 100%;
        background: #0a0a14;
        border: 1px solid #ffffff15;
        color: #e2e2f0;
        border-radius: 0.75rem;
        padding: 0.75rem 1rem;
        font-size: 0.875rem;
        line-height: 1.5;
        outline: none;
        transition:
          border-color 0.18s,
          box-shadow 0.18s;
        font-family: inherit;
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
      .form-input.valid-state {
        border-color: rgba(74, 222, 128, 0.4);
      }

      .form-select {
        display: block;
        width: 100%;
        background: #0a0a14;
        border: 1px solid #ffffff15;
        color: #e2e2f0;
        border-radius: 0.75rem;
        padding: 0.75rem 2.5rem 0.75rem 1rem;
        font-size: 0.875rem;
        line-height: 1.5;
        outline: none;
        appearance: none;
        -webkit-appearance: none;
        transition:
          border-color 0.18s,
          box-shadow 0.18s;
        cursor: pointer;
        font-family: inherit;
      }
      .form-select:focus {
        border-color: #f97316;
        box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.15);
      }
      .form-select.error-state {
        border-color: rgba(239, 68, 68, 0.5);
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.08);
      }
      .form-select.valid-state {
        border-color: rgba(74, 222, 128, 0.4);
      }
      .form-select option {
        background: #11111e;
        color: #e2e2f0;
      }

      textarea.form-input {
        resize: vertical;
        min-height: 6.5rem;
        padding-top: 0.75rem;
        line-height: 1.65;
      }

      .ghost-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #ffffff20;
        color: #a0a0c0;
        border-radius: 1rem;
        padding: 0.75rem 1.5rem;
        font-weight: 700;
        font-size: 0.875rem;
        background: transparent;
        transition:
          border-color 0.18s,
          color 0.18s,
          background 0.18s;
        cursor: pointer;
        font-family: inherit;
      }
      .ghost-btn:hover {
        border-color: #f97316;
        color: #f97316;
        background: rgba(249, 115, 22, 0.04);
      }

      .progress-bar {
        height: 3px;
        border-radius: 99px;
        background: linear-gradient(90deg, #f97316, #ef4444);
        animation: progressFill 0.5s ease both;
        transition: width 0.45s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .section-icon {
        width: 1.375rem;
        height: 1.375rem;
        border-radius: 0.375rem;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        background: rgba(249, 115, 22, 0.12);
      }

      .field-hint {
        font-size: 0.7rem;
        margin-top: 0.3rem;
        color: #6060a0;
        line-height: 1.4;
      }

      .error-msg {
        display: flex;
        align-items: center;
        gap: 0.375rem;
        font-size: 0.7rem;
        margin-top: 0.3rem;
        color: #f87171;
        line-height: 1.4;
      }

      @media (max-width: 640px) {
        .actions-sticky {
          position: sticky;
          bottom: 0;
          margin-left: -1.5rem;
          margin-right: -1.5rem;
          margin-bottom: -1.5rem;
          padding: 1rem 1.5rem 1.25rem;
          border-top: 1px solid #ffffff08;
          background: #11111e;
          border-radius: 0 0 1.5rem 1.5rem;
          z-index: 10;
        }
      }

      input[type='number']::-webkit-inner-spin-button,
      input[type='number']::-webkit-outer-spin-button {
        -webkit-appearance: none;
      }
      input[type='number'] {
        -moz-appearance: textfield;
      }
    `,
  ],
  template: `
    <div
      class="min-h-screen px-4 py-10 pb-24 sm:pb-10"
      style="background:#0a0a14;color:#e2e2f0;"
    >
      <!-- ─── Header ──────────────────────────────────────────── -->
      <div class="max-w-2xl mx-auto mb-8">
        <!-- Breadcrumb -->
        <nav
          class="flex items-center gap-2 mb-5 text-sm"
          aria-label="Breadcrumb"
        >
          <a
            routerLink="/admin/products"
            class="inline-flex items-center gap-1.5 font-semibold transition-colors"
            style="color:#6060a0;"
            onmouseenter="this.style.color='#f97316'"
            onmouseleave="this.style.color='#6060a0'"
          >
            <svg
              class="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Productos
          </a>
          <span style="color:#ffffff20;" aria-hidden="true">/</span>
          <span
            class="inline-flex items-center text-xs font-black px-2.5 py-1 rounded-full"
            [style]="
              isEditMode()
                ? 'background:rgba(96,165,250,0.12);color:#60a5fa;'
                : 'background:rgba(74,222,128,0.12);color:#4ade80;'
            "
          >
            {{ isEditMode() ? 'Editando' : 'Nuevo' }}
          </span>
        </nav>

        <!-- Title row -->
        <div class="flex items-start gap-4">
          <div
            class="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style="background:linear-gradient(135deg,#f97316,#ef4444);
                      box-shadow:0 4px 20px rgba(249,115,22,0.3);"
          >
            <svg
              class="w-6 h-6"
              style="color:#fff;"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                d="M20.5 8.5c-.28 0-.55.04-.81.1L17 5H7L4.5 8.5H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h.28l.72 5h18l.72-5H22a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-1.5zm-9 1 1-2h3l1 2h-5z"
              />
            </svg>
          </div>
          <div>
            <h1
              class="text-3xl font-black leading-tight tracking-tight"
              style="background:linear-gradient(135deg,#ffffff 35%,#f97316 100%);
                       -webkit-background-clip:text;-webkit-text-fill-color:transparent;
                       background-clip:text;"
            >
              {{ isEditMode() ? 'Editar Producto' : 'Nuevo Producto' }}
            </h1>
            <p class="text-xs mt-1" style="color:#6060a0;">
              {{
                isEditMode()
                  ? 'Modifica los campos que necesitas actualizar'
                  : 'Completa todos los campos para agregar al catálogo'
              }}
            </p>
          </div>
        </div>

        <!-- Progress bar -->
        @if (!loadingProduct()) {
          <div class="mt-5">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-semibold" style="color:#6060a0;">
                Campos completados
              </span>
              <span
                class="text-xs font-black tabular-nums"
                style="color:#f97316;"
              >
                {{ completedFields() }}/{{ totalFields }}
              </span>
            </div>
            <div
              class="rounded-full overflow-hidden"
              style="height:3px;background:#ffffff08;"
            >
              <div
                class="progress-bar"
                [style]="'width:' + progressPct() + '%'"
              ></div>
            </div>
          </div>
        }
      </div>

      <!-- ─── Loading skeleton ──────────────────────────────── -->
      @if (loadingProduct()) {
        <div
          class="max-w-2xl mx-auto rounded-3xl border p-6 sm:p-8 space-y-7"
          style="background:#11111e;border-color:#ffffff0d;"
          aria-label="Cargando formulario"
          aria-busy="true"
        >
          <!-- Identification -->
          <div class="space-y-3">
            <div class="h-3 skeleton-shimmer rounded w-28"></div>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <div class="h-2.5 skeleton-shimmer rounded w-16"></div>
                <div class="h-11 skeleton-shimmer rounded-xl"></div>
              </div>
              <div class="space-y-2">
                <div class="h-2.5 skeleton-shimmer rounded w-20"></div>
                <div class="h-11 skeleton-shimmer rounded-xl"></div>
              </div>
            </div>
          </div>

          <div class="h-px" style="background:#ffffff08;"></div>

          <!-- Description -->
          <div class="space-y-2">
            <div class="h-3 skeleton-shimmer rounded w-24"></div>
            <div class="h-2.5 skeleton-shimmer rounded w-36 mt-3"></div>
            <div class="h-24 skeleton-shimmer rounded-xl mt-1"></div>
          </div>

          <div class="h-px" style="background:#ffffff08;"></div>

          <!-- Variant -->
          <div class="space-y-3">
            <div class="h-3 skeleton-shimmer rounded w-20"></div>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <div class="h-2.5 skeleton-shimmer rounded w-12"></div>
                <div class="h-11 skeleton-shimmer rounded-xl"></div>
              </div>
              <div class="space-y-2">
                <div class="h-2.5 skeleton-shimmer rounded w-14"></div>
                <div class="h-11 skeleton-shimmer rounded-xl"></div>
              </div>
            </div>
          </div>

          <div class="h-px" style="background:#ffffff08;"></div>

          <!-- Price and stock -->
          <div class="space-y-3">
            <div class="h-3 skeleton-shimmer rounded w-28"></div>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <div class="h-2.5 skeleton-shimmer rounded w-24"></div>
                <div class="h-11 skeleton-shimmer rounded-xl"></div>
              </div>
              <div class="space-y-2">
                <div class="h-2.5 skeleton-shimmer rounded w-16"></div>
                <div class="h-11 skeleton-shimmer rounded-xl"></div>
              </div>
            </div>
          </div>

          <div class="h-px" style="background:#ffffff08;"></div>

          <!-- Image -->
          <div class="space-y-2">
            <div class="h-3 skeleton-shimmer rounded w-36"></div>
            <div class="h-2.5 skeleton-shimmer rounded w-28 mt-3"></div>
            <div class="h-11 skeleton-shimmer rounded-xl mt-1"></div>
            <div
              class="flex items-center gap-4 mt-3 p-4 rounded-2xl"
              style="background:#0a0a14;"
            >
              <div
                class="w-20 h-20 skeleton-shimmer rounded-2xl flex-shrink-0"
              ></div>
              <div class="flex-1 space-y-2">
                <div class="h-2.5 skeleton-shimmer rounded w-16"></div>
                <div class="h-3 skeleton-shimmer rounded w-32"></div>
                <div class="h-2.5 skeleton-shimmer rounded w-24"></div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="grid grid-cols-2 gap-3 pt-1">
            <div class="h-12 skeleton-shimmer rounded-2xl"></div>
            <div class="h-12 skeleton-shimmer rounded-2xl"></div>
          </div>
        </div>
      }

      <!-- ─── Form ──────────────────────────────────────────── -->
      @else {
        <form
          [formGroup]="form"
          (ngSubmit)="onSubmit()"
          novalidate
          class="card-enter max-w-2xl mx-auto rounded-3xl border p-6 sm:p-8 space-y-7"
          style="background:#11111e;border-color:#ffffff0d;
                     box-shadow:0 24px 64px rgba(0,0,0,0.5),0 0 0 1px rgba(249,115,22,0.04);"
        >
          <!-- ── Section: Identification ────────────────────── -->
          <section>
            <div class="flex items-center gap-2.5 mb-5">
              <span class="section-icon">
                <svg
                  class="w-3 h-3"
                  style="color:#f97316;"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
              </span>
              <h2
                class="text-xs font-black uppercase tracking-widest"
                style="color:#a0a0c0;"
              >
                Identificación
              </h2>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <!-- Code -->
              <div>
                <label
                  for="field-code"
                  class="block text-xs font-bold uppercase tracking-widest mb-2"
                  style="color:#6060a0;"
                >
                  Código
                  <span style="color:#f97316;" aria-hidden="true">*</span>
                </label>
                <input
                  id="field-code"
                  formControlName="code"
                  type="text"
                  placeholder="NK-AM270-10-BLK"
                  autocomplete="off"
                  aria-required="true"
                  [attr.aria-describedby]="
                    showError('code') ? 'err-code' : null
                  "
                  [class]="fieldClass('code')"
                />
                <p class="field-hint">Ej: marca-modelo-talla-color</p>
                @if (showError('code')) {
                  <p id="err-code" class="error-msg" role="alert">
                    <svg
                      class="w-3 h-3 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    El código es requerido
                  </p>
                }
              </div>

              <!-- Name -->
              <div>
                <label
                  for="field-name"
                  class="block text-xs font-bold uppercase tracking-widest mb-2"
                  style="color:#6060a0;"
                >
                  Nombre
                  <span style="color:#f97316;" aria-hidden="true">*</span>
                </label>
                <input
                  id="field-name"
                  formControlName="name"
                  type="text"
                  placeholder="Nike Air Max 270"
                  autocomplete="off"
                  aria-required="true"
                  [attr.aria-describedby]="
                    showError('name') ? 'err-name' : null
                  "
                  [class]="fieldClass('name')"
                />
                <p class="field-hint">Nombre comercial del producto</p>
                @if (showError('name')) {
                  <p id="err-name" class="error-msg" role="alert">
                    <svg
                      class="w-3 h-3 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    El nombre es requerido
                  </p>
                }
              </div>
            </div>
          </section>

          <div
            class="h-px"
            style="background:#ffffff08;"
            role="separator"
          ></div>

          <!-- ── Sección: Description ──────────────────────── -->
          <section>
            <div class="flex items-center gap-2.5 mb-5">
              <span class="section-icon">
                <svg
                  class="w-3 h-3"
                  style="color:#f97316;"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <line x1="21" y1="6" x2="3" y2="6" />
                  <line x1="21" y1="12" x2="3" y2="12" />
                  <line x1="17" y1="18" x2="3" y2="18" />
                </svg>
              </span>
              <h2
                class="text-xs font-black uppercase tracking-widest"
                style="color:#a0a0c0;"
              >
                Descripción
              </h2>
            </div>

            <label
              for="field-desc"
              class="block text-xs font-bold uppercase tracking-widest mb-2"
              style="color:#6060a0;"
            >
              Descripción del producto
              <span style="color:#f97316;" aria-hidden="true">*</span>
            </label>
            <textarea
              id="field-desc"
              formControlName="description"
              rows="4"
              placeholder="Describe las características clave: tecnología, uso, materiales..."
              aria-required="true"
              [attr.aria-describedby]="
                showError('description') ? 'err-desc' : null
              "
              [class]="fieldClass('description')"
            ></textarea>
            <div class="flex items-start justify-between mt-1.5">
              <div>
                @if (showError('description')) {
                  <p id="err-desc" class="error-msg" role="alert">
                    <svg
                      class="w-3 h-3 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    La descripción es requerida
                  </p>
                }
              </div>
              <span
                class="text-xs flex-shrink-0 ml-3 tabular-nums"
                style="color:#6060a0;"
              >
                {{ form.get('description')?.value?.length || 0 }} car.
              </span>
            </div>
          </section>

          <div
            class="h-px"
            style="background:#ffffff08;"
            role="separator"
          ></div>

          <!-- ── Section: Variant ──────────────────────────── -->
          <section>
            <div class="flex items-center gap-2.5 mb-5">
              <span class="section-icon">
                <svg
                  class="w-3 h-3"
                  style="color:#f97316;"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </span>
              <h2
                class="text-xs font-black uppercase tracking-widest"
                style="color:#a0a0c0;"
              >
                Variante del producto
              </h2>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <!-- Size -->
              <div>
                <label
                  for="field-size"
                  class="block text-xs font-bold uppercase tracking-widest mb-2"
                  style="color:#6060a0;"
                >
                  Talla <span style="color:#f97316;" aria-hidden="true">*</span>
                </label>
                <div class="relative">
                  <select
                    id="field-size"
                    formControlName="size"
                    aria-required="true"
                    [attr.aria-describedby]="
                      showError('size') ? 'err-size' : null
                    "
                    [class]="selectClass('size')"
                  >
                    <option value="">— Seleccionar talla —</option>
                    <option value="S7">Talla 7</option>
                    <option value="S8">Talla 8</option>
                    <option value="S9">Talla 9</option>
                    <option value="S10">Talla 10</option>
                  </select>
                  <svg
                    class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                    style="color:#6060a0;"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
                @if (showError('size')) {
                  <p id="err-size" class="error-msg" role="alert">
                    <svg
                      class="w-3 h-3 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    Selecciona una talla
                  </p>
                }
              </div>

              <!-- Color -->
              <div>
                <label
                  for="field-color"
                  class="block text-xs font-bold uppercase tracking-widest mb-2"
                  style="color:#6060a0;"
                >
                  Color <span style="color:#f97316;" aria-hidden="true">*</span>
                </label>
                <div class="relative">
                  @if (selectedColorHex()) {
                    <span
                      class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full pointer-events-none"
                      style="border:1px solid rgba(255,255,255,0.2);"
                      [style.background]="selectedColorHex()"
                    >
                    </span>
                  }
                  <select
                    id="field-color"
                    formControlName="color"
                    aria-required="true"
                    [attr.aria-describedby]="
                      showError('color') ? 'err-color' : null
                    "
                    [style]="selectedColorHex() ? 'padding-left:2.5rem;' : ''"
                    [class]="selectClass('color')"
                  >
                    <option value="">— Seleccionar color —</option>
                    <option value="Blanco">Blanco</option>
                    <option value="Negro">Negro</option>
                    <option value="Gris">Gris</option>
                  </select>
                  <svg
                    class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                    style="color:#6060a0;"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
                @if (showError('color')) {
                  <p id="err-color" class="error-msg" role="alert">
                    <svg
                      class="w-3 h-3 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    Selecciona un color
                  </p>
                }
              </div>
            </div>
          </section>

          <div
            class="h-px"
            style="background:#ffffff08;"
            role="separator"
          ></div>

          <!-- ── Section: Price and stock ───────────────────── -->
          <section>
            <div class="flex items-center gap-2.5 mb-5">
              <span class="section-icon">
                <svg
                  class="w-3 h-3"
                  style="color:#f97316;"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </span>
              <h2
                class="text-xs font-black uppercase tracking-widest"
                style="color:#a0a0c0;"
              >
                Precio y stock
              </h2>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <!-- Price -->
              <div>
                <label
                  for="field-price"
                  class="block text-xs font-bold uppercase tracking-widest mb-2"
                  style="color:#6060a0;"
                >
                  Precio (COP)
                  <span style="color:#f97316;" aria-hidden="true">*</span>
                </label>
                <div class="relative">
                  <span
                    class="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-black pointer-events-none select-none"
                    style="color:#6060a0;"
                    aria-hidden="true"
                    >$</span
                  >
                  <input
                    id="field-price"
                    formControlName="price"
                    type="number"
                    min="1"
                    placeholder="389000"
                    aria-required="true"
                    [attr.aria-describedby]="
                      showError('price') ? 'err-price' : null
                    "
                    style="padding-left:1.85rem;"
                    [class]="fieldClass('price')"
                  />
                </div>
                <p class="field-hint">Valor en pesos colombianos</p>
                @if (showError('price')) {
                  <p id="err-price" class="error-msg" role="alert">
                    <svg
                      class="w-3 h-3 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    El precio debe ser mayor a 0
                  </p>
                }
              </div>

              <!-- Stock -->
              <div>
                <label
                  for="field-stock"
                  class="block text-xs font-bold uppercase tracking-widest mb-2"
                  style="color:#6060a0;"
                >
                  Stock inicial
                  <span style="color:#f97316;" aria-hidden="true">*</span>
                </label>
                <input
                  id="field-stock"
                  formControlName="stock"
                  type="number"
                  min="0"
                  placeholder="50"
                  aria-required="true"
                  [attr.aria-describedby]="
                    showError('stock') ? 'err-stock' : null
                  "
                  [class]="fieldClass('stock')"
                />
                <p class="field-hint" [style]="stockHintStyle()">
                  {{ stockHintText() }}
                </p>
                @if (showError('stock')) {
                  <p id="err-stock" class="error-msg" role="alert">
                    <svg
                      class="w-3 h-3 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    El stock no puede ser negativo
                  </p>
                }
              </div>
            </div>
          </section>

          <div
            class="h-px"
            style="background:#ffffff08;"
            role="separator"
          ></div>

          <!-- ── Section: Image ───────────────────────────── -->
          <section>
            <div class="flex items-center gap-2.5 mb-5">
              <span class="section-icon">
                <svg
                  class="w-3 h-3"
                  style="color:#f97316;"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </span>
              <h2
                class="text-xs font-black uppercase tracking-widest"
                style="color:#a0a0c0;"
              >
                Imagen del producto
              </h2>
            </div>

            <label
              for="field-img"
              class="block text-xs font-bold uppercase tracking-widest mb-2"
              style="color:#6060a0;"
            >
              URL de imagen
              <span style="color:#f97316;" aria-hidden="true">*</span>
            </label>
            <input
              id="field-img"
              formControlName="imageUrl"
              type="text"
              placeholder="https://ejemplo.com/producto.jpg"
              autocomplete="off"
              aria-required="true"
              [attr.aria-describedby]="showError('imageUrl') ? 'err-img' : null"
              [class]="fieldClass('imageUrl')"
            />
            <p class="field-hint">URL pública accesible (jpg, png, webp)</p>
            @if (showError('imageUrl')) {
              <p id="err-img" class="error-msg" role="alert">
                <svg
                  class="w-3 h-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
                La URL de imagen es requerida
              </p>
            }

            <!-- Preview -->
            @if (form.get('imageUrl')?.value) {
              <div
                class="mt-4 flex items-center gap-4 p-4 rounded-2xl border"
                style="background:#0a0a14;border-color:#ffffff0d;"
              >
                <div
                  class="flex-shrink-0 rounded-2xl overflow-hidden"
                  style="width:88px;height:88px;background:#11111e;border:1px solid #ffffff15;"
                >
                  <img
                    [src]="form.get('imageUrl')?.value"
                    [alt]="
                      form.get('name')?.value || 'Vista previa del producto'
                    "
                    width="88"
                    height="88"
                    loading="lazy"
                    class="w-full h-full object-cover"
                    (error)="onImageError($event)"
                  />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-xs font-bold mb-1" style="color:#6060a0;">
                    Vista previa
                  </p>
                  @if (form.get('name')?.value) {
                    <p
                      class="text-sm font-black truncate mb-1"
                      style="color:#e2e2f0;"
                    >
                      {{ form.get('name')?.value }}
                    </p>
                  }
                  <p class="text-xs font-mono truncate" style="color:#6060a0;">
                    {{ form.get('imageUrl')?.value }}
                  </p>
                </div>
              </div>
            }
          </section>

          <!-- ── Server error ──────────────────────────── -->
          @if (serverError()) {
            <div
              class="flex items-center gap-3 px-4 py-3.5 rounded-xl border"
              style="background:rgba(239,68,68,0.08);border-color:rgba(239,68,68,0.28);color:#f87171;"
              role="alert"
            >
              <svg
                class="w-4 h-4 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span class="text-sm font-semibold">{{ serverError() }}</span>
            </div>
          }

          <!-- ── Actions ───────────────────────────────────── -->
          <div class="actions-sticky flex items-center gap-3 pt-2">
            <button
              type="button"
              routerLink="/admin/products"
              class="ghost-btn flex-1"
            >
              Cancelar
            </button>
            <button
              type="submit"
              [disabled]="saving() || form.invalid"
              class="btn-primary flex-1 flex items-center justify-center gap-2
                           py-3.5 rounded-2xl font-black text-sm"
              style="color:#fff;"
            >
              @if (saving()) {
                <svg
                  class="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
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
                <span>Guardando...</span>
              } @else if (isEditMode()) {
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span>Actualizar producto</span>
              } @else {
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span>Crear producto</span>
              }
            </button>
          </div>
        </form>
      }
    </div>
  `,
})
export class AdminProductFormComponent {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEditMode = signal(false);
  loadingProduct = signal(false);
  saving = signal(false);
  serverError = signal('');
  productId = signal<number | null>(null);

  readonly totalFields = 8;

  form = this.fb.group({
    code: ['', Validators.required],
    name: ['', Validators.required],
    description: ['', Validators.required],
    size: ['', Validators.required],
    color: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(1)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    imageUrl: ['', Validators.required],
  });

  private _formSnapshot = signal<Record<string, unknown>>({});

  constructor() {
    effect((onCleanup) => {
      const sub = this.form.valueChanges.subscribe((v) => {
        this._formSnapshot.set(v as Record<string, unknown>);
      });
      onCleanup(() => sub.unsubscribe());
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.productId.set(+id);
      this.loadProduct(+id);
    }
  }

  completedFields = computed(() => {
    const v = this._formSnapshot();
    const fields = [
      'code',
      'name',
      'description',
      'size',
      'color',
      'price',
      'stock',
      'imageUrl',
    ];
    return fields.filter((f) => {
      const val = v[f];
      if (f === 'price') return typeof val === 'number' && val > 0;
      if (f === 'stock') return typeof val === 'number' && val >= 0;
      return !!val;
    }).length;
  });

  progressPct = computed(() =>
    Math.round((this.completedFields() / this.totalFields) * 100),
  );

  selectedColorHex = computed(() => {
    const color = this._formSnapshot()['color'] as string | undefined;
    const map: Record<string, string> = {
      Blanco: '#f5f5f5',
      Negro: '#1a1a1a',
      Gris: '#9ca3af',
    };
    return color ? (map[color] ?? '') : '';
  });

  loadProduct(id: number): void {
    this.loadingProduct.set(true);
    this.productService.getById(id).subscribe({
      next: (res) => {
        const p = res.data;
        if (p) {
          this.form.patchValue({
            code: p.code,
            name: p.name,
            description: p.description,
            size: SIZE_REVERSE[p.size] ?? p.size,
            color: p.color,
            price: p.price,
            stock: p.stock,
            imageUrl: p.imageUrl,
          });
        }
        this.loadingProduct.set(false); 
      },
      error: () => this.loadingProduct.set(false),
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.serverError.set('');
    const raw = this.form.value as any;

    const payload = {
      code: raw.code,
      name: raw.name,
      description: raw.description,
      size: PRODUCT_SIZE_MAP[raw.size as keyof typeof PRODUCT_SIZE_MAP],
      color: PRODUCT_COLOR_MAP[raw.color as keyof typeof PRODUCT_COLOR_MAP],
      price: raw.price,
      stock: raw.stock,
      imageUrl: raw.imageUrl,
    };

    const request$ = this.isEditMode()
      ? this.productService.update(this.productId()!, payload)
      : this.productService.create(payload);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['/admin/products']);
      },
      error: (err) => {
        this.serverError.set(
          err.error?.detail ?? 'Error al guardar el producto',
        );
        this.saving.set(false);
      },
    });
  }

  // ── Template helpers ────────────────────────────────────────

  showError(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  fieldClass(field: string): string {
    const ctrl = this.form.get(field);
    if (ctrl?.invalid && ctrl?.touched) return 'form-input error-state';
    if (ctrl?.valid && ctrl?.touched && ctrl?.value)
      return 'form-input valid-state';
    return 'form-input';
  }

  selectClass(field: string): string {
    const ctrl = this.form.get(field);
    if (ctrl?.invalid && ctrl?.touched) return 'form-select error-state';
    if (ctrl?.valid && ctrl?.touched && ctrl?.value)
      return 'form-select valid-state';
    return 'form-select';
  }

  stockHintText(): string {
    const val = this.form.get('stock')?.value;
    if (val === null || val === undefined || val === 0)
      return 'Unidades disponibles para venta';
    if ((val as number) <= 5) return '⚠ Stock crítico';
    if ((val as number) <= 10) return '⚡ Stock bajo';
    return '✓ Stock saludable';
  }

  stockHintStyle(): string {
    const val = this.form.get('stock')?.value as number;
    if (!val || val === 0)
      return 'color:#6060a0;font-size:0.7rem;margin-top:0.3rem;';
    if (val <= 5)
      return 'color:#f87171;font-size:0.7rem;margin-top:0.3rem;font-weight:700;';
    if (val <= 10)
      return 'color:#fbbf24;font-size:0.7rem;margin-top:0.3rem;font-weight:600;';
    return 'color:#4ade80;font-size:0.7rem;margin-top:0.3rem;font-weight:600;';
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src =
      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="88" height="88"%3E%3Crect fill="%2311111e" width="88" height="88" rx="12"/%3E%3Ctext x="44" y="44" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="11" fill="%236060a0"%3EIMG%3C/text%3E%3C/svg%3E';
  }
}
