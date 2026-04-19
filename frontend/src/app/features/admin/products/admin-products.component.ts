import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { CurrencyCopPipe } from '../../../shared/pipes/currency-cop.pipe';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyCopPipe],
  styles: [
    `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(12px);
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
      @keyframes modalIn {
        from {
          opacity: 0;
          transform: scale(0.95) translateY(10px);
        }
        to {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }
      .table-enter {
        animation: fadeInUp 0.35s ease both;
      }
      .modal-enter {
        animation: modalIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) both;
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
      .btn-primary:hover {
        filter: brightness(1.1);
        transform: translateY(-1px);
        box-shadow: 0 8px 28px rgba(249, 115, 22, 0.4);
      }
      .btn-primary:active {
        transform: translateY(0);
      }

      .search-input {
        width: 100%;
        background: #0a0a14;
        border: 1px solid #ffffff15;
        color: #e2e2f0;
        border-radius: 0.875rem;
        padding: 0.75rem 1rem 0.75rem 2.75rem;
        font-size: 0.875rem;
        outline: none;
        transition:
          border-color 0.18s,
          box-shadow 0.18s;
      }
      .search-input::placeholder {
        color: #6060a0;
      }
      .search-input:focus {
        border-color: #f97316;
        box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.15);
      }

      .tr-hover {
        transition: background 0.15s;
      }
      .tr-hover:hover {
        background: rgba(249, 115, 22, 0.04);
      }

      .action-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        padding: 0.35rem 0.65rem;
        border-radius: 0.5rem;
        font-size: 0.75rem;
        font-weight: 700;
        border: 1px solid transparent;
        transition:
          background 0.15s,
          color 0.15s,
          border-color 0.15s;
        cursor: pointer;
        background: transparent;
      }
      .action-edit {
        color: #60a5fa;
        border-color: rgba(96, 165, 250, 0.2);
      }
      .action-edit:hover {
        background: rgba(96, 165, 250, 0.1);
        border-color: rgba(96, 165, 250, 0.4);
      }
      .action-toggle-off {
        color: #fbbf24;
        border-color: rgba(251, 191, 36, 0.2);
      }
      .action-toggle-off:hover {
        background: rgba(251, 191, 36, 0.1);
        border-color: rgba(251, 191, 36, 0.4);
      }
      .action-toggle-on {
        color: #4ade80;
        border-color: rgba(74, 222, 128, 0.2);
      }
      .action-toggle-on:hover {
        background: rgba(74, 222, 128, 0.1);
        border-color: rgba(74, 222, 128, 0.4);
      }
      .action-delete {
        color: #f87171;
        border-color: rgba(248, 113, 113, 0.2);
      }
      .action-delete:hover {
        background: rgba(248, 113, 113, 0.1);
        border-color: rgba(248, 113, 113, 0.4);
      }

      .page-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 2rem;
        height: 2rem;
        padding: 0 0.65rem;
        border-radius: 0.5rem;
        font-size: 0.75rem;
        font-weight: 700;
        border: 1px solid #ffffff15;
        background: transparent;
        color: #a0a0c0;
        cursor: pointer;
        transition:
          border-color 0.15s,
          color 0.15s,
          background 0.15s;
      }
      .page-btn:hover:not(:disabled) {
        border-color: #f97316;
        color: #f97316;
      }
      .page-btn:disabled {
        opacity: 0.35;
        cursor: not-allowed;
      }
      .page-btn-active {
        background: linear-gradient(135deg, #f97316, #ef4444);
        border-color: transparent;
        color: #fff;
      }

      .ghost-btn {
        background: transparent;
        border: 1px solid #ffffff20;
        color: #a0a0c0;
        border-radius: 0.875rem;
        padding: 0.65rem 1.25rem;
        font-weight: 700;
        font-size: 0.875rem;
        cursor: pointer;
        transition:
          border-color 0.18s,
          color 0.18s;
      }
      .ghost-btn:hover {
        border-color: #f97316;
        color: #f97316;
      }

      .btn-danger {
        background: linear-gradient(135deg, #ef4444, #dc2626);
        color: #fff;
        border: none;
        border-radius: 0.875rem;
        padding: 0.65rem 1.25rem;
        font-weight: 700;
        font-size: 0.875rem;
        cursor: pointer;
        transition:
          filter 0.18s,
          transform 0.15s;
      }
      .btn-danger:hover:not(:disabled) {
        filter: brightness(1.1);
        transform: translateY(-1px);
      }
      .btn-danger:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }

      ::-webkit-scrollbar {
        height: 4px;
        width: 4px;
      }
      ::-webkit-scrollbar-track {
        background: #0f0f1a;
      }
      ::-webkit-scrollbar-thumb {
        background: #f97316;
        border-radius: 99px;
      }
    `,
  ],
  template: `
    <div class="min-h-screen" style="background:#0a0a14;color:#e2e2f0;">
      <!-- ─── Header ────────────────────────────────────────────── -->
      <header
        class="relative overflow-hidden py-12 px-4"
        style="background:linear-gradient(135deg,#0f0f1e 0%,#1a0a05 60%,#0f0f1e 100%);"
      >
        <div
          class="absolute -top-16 -right-16 w-72 h-72 rounded-full opacity-20 pointer-events-none"
          style="background:radial-gradient(circle,#f97316,transparent 70%);"
        ></div>
        <div
          class="relative max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4"
        >
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="w-2 h-2 rounded-full bg-orange-500"></span>
              <span
                class="text-orange-400 font-bold tracking-[0.2em] text-xs uppercase"
                >Panel admin</span
              >
            </div>
            <h1
              class="text-3xl sm:text-4xl font-black tracking-tight"
              style="background:linear-gradient(135deg,#fff 40%,#f97316);
                       -webkit-background-clip:text;-webkit-text-fill-color:transparent;"
            >
              Gestión de Productos
            </h1>
            <p class="text-sm mt-1" style="color:#a0a0c0;">
              <span class="font-black text-white">{{ products().length }}</span>
              productos en catálogo
            </p>
          </div>
          <a
            routerLink="/admin/products/new"
            class="btn-primary inline-flex items-center gap-2 px-5 py-3 rounded-2xl
                    font-black text-white text-sm"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              viewBox="0 0 24 24"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nuevo Producto
          </a>
        </div>
      </header>

      <div class="max-w-7xl mx-auto px-4 py-8 space-y-5">
        <!-- ─── Search bar ─────────────────────────────────────── -->
        <div class="relative">
          <svg
            class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style="color:#6060a0;"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            class="search-input"
            placeholder="Buscar por nombre o código..."
            [value]="searchTerm()"
            (input)="onSearch($event)"
          />
          @if (searchTerm()) {
            <button
              (click)="clearSearch()"
              class="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full
                           flex items-center justify-center transition-colors"
              style="color:#6060a0;background:#ffffff10;"
              onmouseenter="this.style.color='#f97316'"
              onmouseleave="this.style.color='#6060a0'"
            >
              <svg
                class="w-3 h-3"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                viewBox="0 0 24 24"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          }
        </div>

        <!-- ─── Loading skeletons ────────────────────────────────── -->
        @if (loading()) {
          <div
            class="rounded-3xl overflow-hidden border"
            style="background:#11111e;border-color:#ffffff08;"
          >
            <div class="p-4 border-b" style="border-color:#ffffff08;">
              <div class="grid grid-cols-9 gap-4">
                @for (i of [1, 2, 3, 4, 5, 6, 7, 8, 9]; track i) {
                  <div class="h-3 skeleton-shimmer rounded-lg"></div>
                }
              </div>
            </div>
            @for (i of [1, 2, 3, 4, 5, 6, 7, 8]; track i) {
              <div
                class="p-4 border-b flex items-center gap-4"
                style="border-color:#ffffff06;"
              >
                <div
                  class="w-12 h-12 skeleton-shimmer rounded-xl flex-shrink-0"
                ></div>
                <div class="flex-1 grid grid-cols-7 gap-4">
                  @for (j of [1, 2, 3, 4, 5, 6, 7]; track j) {
                    <div class="h-3 skeleton-shimmer rounded-lg"></div>
                  }
                </div>
              </div>
            }
          </div>
        }

        <!-- ─── Empty state ──────────────────────────────────────── -->
        @else if (filteredProducts().length === 0) {
          <div
            class="flex flex-col items-center justify-center py-24 text-center
                      rounded-3xl border"
            style="background:#11111e;border-color:#ffffff08;"
          >
            <div
              class="w-20 h-20 rounded-3xl flex items-center justify-center mb-5 text-4xl"
              style="background:linear-gradient(135deg,#f9731615,#ef444415);"
            >
              👟
            </div>
            <h3 class="text-xl font-black text-white mb-2">
              @if (searchTerm()) {
                Sin resultados
              } @else {
                Sin productos
              }
            </h3>
            <p class="text-sm mb-6" style="color:#6060a0;">
              @if (searchTerm()) {
                Ningún producto coincide con "{{ searchTerm() }}"
              } @else {
                Crea el primer producto con el botón de arriba
              }
            </p>
            @if (!searchTerm()) {
              <a
                routerLink="/admin/products/new"
                class="btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-white text-sm"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  viewBox="0 0 24 24"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Nuevo producto
              </a>
            }
          </div>
        }

        <!-- ─── Products table ───────────────────────────────────── -->
        @else {
          <div
            class="table-enter rounded-3xl overflow-hidden border"
            style="background:#11111e;border-color:#ffffff08;"
          >
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr
                    style="background:#ffffff05;border-bottom:1px solid #ffffff08;"
                  >
                    <th
                      class="px-4 py-3.5 text-left text-xs font-black uppercase tracking-widest w-16"
                      style="color:#6060a0;"
                    >
                      Img
                    </th>
                    <th
                      class="px-4 py-3.5 text-left text-xs font-black uppercase tracking-widest"
                      style="color:#6060a0;"
                    >
                      Código
                    </th>
                    <th
                      class="px-4 py-3.5 text-left text-xs font-black uppercase tracking-widest"
                      style="color:#6060a0;"
                    >
                      Nombre
                    </th>
                    <th
                      class="px-4 py-3.5 text-left text-xs font-black uppercase tracking-widest"
                      style="color:#6060a0;"
                    >
                      Talla
                    </th>
                    <th
                      class="px-4 py-3.5 text-left text-xs font-black uppercase tracking-widest"
                      style="color:#6060a0;"
                    >
                      Color
                    </th>
                    <th
                      class="px-4 py-3.5 text-left text-xs font-black uppercase tracking-widest"
                      style="color:#6060a0;"
                    >
                      Precio
                    </th>
                    <th
                      class="px-4 py-3.5 text-left text-xs font-black uppercase tracking-widest"
                      style="color:#6060a0;"
                    >
                      Stock
                    </th>
                    <th
                      class="px-4 py-3.5 text-left text-xs font-black uppercase tracking-widest"
                      style="color:#6060a0;"
                    >
                      Estado
                    </th>
                    <th
                      class="px-4 py-3.5 text-left text-xs font-black uppercase tracking-widest"
                      style="color:#6060a0;"
                    >
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  @for (product of paginatedProducts(); track product.id) {
                    <tr
                      class="tr-hover border-b"
                      style="border-color:#ffffff06;"
                    >
                      <!-- Image -->
                      <td class="px-4 py-3">
                        <img
                          [src]="product.imageUrl"
                          [alt]="product.name"
                          width="48"
                          height="48"
                          loading="lazy"
                          class="w-12 h-12 object-cover rounded-xl"
                          style="border:1px solid #ffffff10;"
                          (error)="onImageError($event)"
                        />
                      </td>

                      <!-- Code -->
                      <td class="px-4 py-3">
                        <span
                          class="text-xs font-mono px-2 py-1 rounded-lg"
                          style="background:#ffffff08;color:#a0a0c0;"
                        >
                          {{ product.code }}
                        </span>
                      </td>

                      <!-- Name -->
                      <td class="px-4 py-3">
                        <p class="font-black text-sm" style="color:#e2e2f0;">
                          {{ product.name }}
                        </p>
                      </td>

                      <!-- Size -->
                      <td class="px-4 py-3">
                        <span
                          class="inline-flex items-center justify-center w-8 h-8 rounded-xl
                                     text-sm font-black"
                          style="background:rgba(249,115,22,0.1);color:#f97316;"
                        >
                          {{ sizeLabel(product.size) }}
                        </span>
                      </td>

                      <!-- Color -->
                      <td class="px-4 py-3">
                        <div class="flex items-center gap-2">
                          <span
                            class="w-4 h-4 rounded-full border flex-shrink-0"
                            [style]="
                              'background:' +
                              colorHex(product.color) +
                              ';border-color:' +
                              (product.color === 'Blanco'
                                ? '#ccc'
                                : 'transparent')
                            "
                          >
                          </span>
                          <span
                            class="text-sm font-semibold"
                            style="color:#a0a0c0;"
                            >{{ product.color }}</span
                          >
                        </div>
                      </td>

                      <!-- Price -->
                      <td class="px-4 py-3">
                        <span class="font-black text-sm" style="color:#f97316;">
                          {{ product.price | currencyCop }}
                        </span>
                      </td>

                      <!-- Stock -->
                      <td class="px-4 py-3">
                        <span
                          class="text-xs font-black px-2.5 py-1 rounded-full"
                          [style]="stockStyle(product.stock)"
                        >
                          {{ product.stock }}
                        </span>
                      </td>

                      <!-- Status -->
                      <td class="px-4 py-3">
                        <span
                          class="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1 rounded-full"
                          [style]="
                            product.isActive
                              ? 'background:rgba(74,222,128,0.1);color:#4ade80;'
                              : 'background:rgba(248,113,113,0.1);color:#f87171;'
                          "
                        >
                          <span
                            class="w-1.5 h-1.5 rounded-full inline-block"
                            [style]="
                              'background:' +
                              (product.isActive ? '#4ade80' : '#f87171')
                            "
                          ></span>
                          {{ product.isActive ? 'Activo' : 'Inactivo' }}
                        </span>
                      </td>

                      <!-- Actions -->
                      <td class="px-4 py-3">
                        <div class="flex items-center gap-1.5 flex-wrap">
                          <a
                            [routerLink]="['/admin/products', product.id]"
                            class="action-btn action-edit"
                          >
                            <svg
                              class="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2.5"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                              />
                              <path
                                d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                              />
                            </svg>
                            Editar
                          </a>
                          <button
                            (click)="toggleActive(product)"
                            [class]="
                              'action-btn ' +
                              (product.isActive
                                ? 'action-toggle-off'
                                : 'action-toggle-on')
                            "
                          >
                            @if (product.isActive) {
                              <svg
                                class="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2.5"
                                viewBox="0 0 24 24"
                              >
                                <circle cx="12" cy="12" r="10" />
                                <line
                                  x1="4.93"
                                  y1="4.93"
                                  x2="19.07"
                                  y2="19.07"
                                />
                              </svg>
                              Desactivar
                            } @else {
                              <svg
                                class="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2.5"
                                viewBox="0 0 24 24"
                              >
                                <path d="M20 6L9 17l-5-5" />
                              </svg>
                              Activar
                            }
                          </button>
                          <button
                            (click)="confirmDelete(product)"
                            class="action-btn action-delete"
                          >
                            <svg
                              class="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2.5"
                              viewBox="0 0 24 24"
                            >
                              <polyline points="3 6 5 6 21 6" />
                              <path
                                d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"
                              />
                              <path d="M10 11v6M14 11v6" />
                              <path
                                d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"
                              />
                            </svg>
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            <!-- ── Pagination ─────────────────────────────────── -->
            @if (totalPages() > 1) {
              <div
                class="flex items-center justify-between px-5 py-4 border-t"
                style="border-color:#ffffff08;"
              >
                <p class="text-xs font-semibold" style="color:#6060a0;">
                  Mostrando
                  <span class="text-white font-black">
                    {{ (currentPage() - 1) * pageSize + 1 }}–{{
                      min(currentPage() * pageSize, filteredProducts().length)
                    }}
                  </span>
                  de
                  <span class="text-white font-black">{{
                    filteredProducts().length
                  }}</span>
                </p>
                <div class="flex items-center gap-1.5">
                  <button
                    (click)="prevPage()"
                    [disabled]="currentPage() === 1"
                    class="page-btn"
                  >
                    <svg
                      class="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      viewBox="0 0 24 24"
                    >
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                  @for (page of pageRange(); track page) {
                    <button
                      (click)="goToPage(page)"
                      [class]="
                        'page-btn ' +
                        (page === currentPage() ? 'page-btn-active' : '')
                      "
                    >
                      {{ page }}
                    </button>
                  }
                  <button
                    (click)="nextPage()"
                    [disabled]="currentPage() === totalPages()"
                    class="page-btn"
                  >
                    <svg
                      class="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      viewBox="0 0 24 24"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>

    <!-- ─── Delete modal ─────────────────────────────────────────── -->
    @if (productToDelete()) {
      <div
        class="fixed inset-0 flex items-center justify-center z-50 px-4"
        style="background:rgba(0,0,0,0.8);backdrop-filter:blur(6px);"
      >
        <div
          class="modal-enter w-full max-w-sm rounded-3xl border p-6"
          style="background:#11111e;border-color:#ffffff0d;
                    box-shadow:0 24px 64px rgba(0,0,0,0.6),0 0 0 1px rgba(239,68,68,0.08);"
        >
          <div
            class="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
            style="background:rgba(239,68,68,0.1);"
          >
            <svg
              class="w-6 h-6"
              style="color:#f87171;"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </div>
          <h3 class="text-lg font-black text-white mb-2">Eliminar producto</h3>
          <p class="text-sm mb-6" style="color:#a0a0c0;">
            ¿Confirmas que deseas eliminar
            <span class="font-black text-white">{{
              productToDelete()?.name
            }}</span
            >? Esta acción no se puede deshacer.
          </p>
          <div class="flex gap-3">
            <button
              (click)="productToDelete.set(null)"
              class="ghost-btn flex-1"
            >
              Cancelar
            </button>
            <button
              (click)="deleteProduct()"
              [disabled]="deleting()"
              class="btn-danger flex-1 flex items-center justify-center gap-2"
            >
              @if (deleting()) {
                <svg
                  class="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
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
                Eliminando...
              } @else {
                Eliminar
              }
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class AdminProductsComponent {
  private productService = inject(ProductService);

  products = signal<Product[]>([]);
  loading = signal(true);
  deleting = signal(false);
  productToDelete = signal<Product | null>(null);
  searchTerm = signal('');
  currentPage = signal(1);
  pageSize = 10;

  filteredProducts = computed(() => {
    const q = this.searchTerm().toLowerCase();
    if (!q) return this.products();
    return this.products().filter(
      (p) =>
        p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q),
    );
  });

  totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredProducts().length / this.pageSize)),
  );

  paginatedProducts = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredProducts().slice(start, start + this.pageSize);
  });

  pageRange = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const delta = 2;
    const range: number[] = [];
    const start = Math.max(1, current - delta);
    const end = Math.min(total, current + delta);
    for (let i = start; i <= end; i++) range.push(i);
    return range;
  });

  constructor() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading.set(true);
    this.productService.getAll({ pageSize: 100 }).subscribe({
      next: (res) => {
        if (res.data) this.products.set(res.data.items);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onSearch(event: Event) {
    this.searchTerm.set((event.target as HTMLInputElement).value);
    this.currentPage.set(1);
  }

  clearSearch() {
    this.searchTerm.set('');
    this.currentPage.set(1);
  }

  sizeLabel(size: string): string {
    const map: Record<string, string> = {
      S7: '7',
      S8: '8',
      S9: '9',
      S10: '10',
    };
    return map[size] ?? size;
  }

  colorHex(color: string): string {
    const map: Record<string, string> = {
      Blanco: '#f5f5f5',
      Negro: '#1a1a1a',
      Gris: '#9ca3af',
    };
    return map[color] ?? '#ccc';
  }

  stockStyle(stock: number): string {
    if (stock === 0) return 'background:rgba(248,113,113,0.12);color:#f87171;';
    if (stock <= 5) return 'background:rgba(251,191,36,0.12);color:#fbbf24;';
    if (stock <= 10) return 'background:rgba(251,191,36,0.08);color:#fcd34d;';
    return 'background:rgba(74,222,128,0.1);color:#4ade80;';
  }

  min(a: number, b: number): number {
    return Math.min(a, b);
  }

  toggleActive(product: Product) {
    this.productService
      .update(product.id, { isActive: !product.isActive })
      .subscribe({
        next: () => this.loadProducts(),
        error: () => alert('No se pudo cambiar el estado del producto.'),
      });
  }

  confirmDelete(product: Product) {
    this.productToDelete.set(product);
  }

  deleteProduct() {
    const product = this.productToDelete();
    if (!product) return;
    this.deleting.set(true);
    this.productService.delete(product.id).subscribe({
      next: () => {
        this.productToDelete.set(null);
        this.deleting.set(false);
        this.loadProducts();
      },
      error: () => this.deleting.set(false),
    });
  }

  goToPage(page: number) {
    this.currentPage.set(page);
  }
  prevPage() {
    if (this.currentPage() > 1) this.currentPage.update((p) => p - 1);
  }
  nextPage() {
    if (this.currentPage() < this.totalPages())
      this.currentPage.update((p) => p + 1);
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src =
      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48"%3E%3Crect fill="%2311111e" width="48" height="48" rx="8"/%3E%3Ctext x="24" y="24" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="10" fill="%236060a0"%3EIMG%3C/text%3E%3C/svg%3E';
  }
}
