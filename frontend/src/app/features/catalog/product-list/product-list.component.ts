import { Component, inject, signal, OnDestroy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { Product, ProductSize, ProductColor, ProductFilter} from '../../../core/models';
import { CurrencyCopPipe } from '../../../shared/pipes/currency-cop.pipe';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, CurrencyCopPipe],
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
      @keyframes toastIn {
        from {
          opacity: 0;
          transform: translateX(40px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateX(0) scale(1);
        }
      }
      @keyframes pulse-dot {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0.4;
        }
      }

      .product-card {
        animation: fadeInUp 0.4s ease both;
      }
      .product-card:nth-child(2) {
        animation-delay: 0.05s;
      }
      .product-card:nth-child(3) {
        animation-delay: 0.1s;
      }
      .product-card:nth-child(4) {
        animation-delay: 0.15s;
      }
      .product-card:nth-child(5) {
        animation-delay: 0.2s;
      }
      .product-card:nth-child(6) {
        animation-delay: 0.25s;
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

      .toast-enter {
        animation: toastIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
      }

      .filter-pill-active {
        background: linear-gradient(135deg, #f97316, #ef4444) !important;
        color: #fff !important;
        border-color: transparent !important;
        box-shadow: 0 4px 14px rgba(249, 115, 22, 0.4);
      }

      .card-img-wrap::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
          to top,
          rgba(0, 0, 0, 0.55) 0%,
          transparent 55%
        );
        pointer-events: none;
      }

      .btn-cart {
        background: linear-gradient(135deg, #f97316 0%, #ef4444 100%);
        transition:
          filter 0.2s,
          transform 0.15s,
          box-shadow 0.2s;
      }
      .btn-cart:hover {
        filter: brightness(1.12);
        transform: translateY(-1px);
        box-shadow: 0 6px 20px rgba(249, 115, 22, 0.35);
      }
      .btn-cart:active {
        transform: translateY(0);
      }

      .qty-btn {
        transition:
          background 0.15s,
          color 0.15s;
      }
      .qty-btn:hover {
        background: rgba(249, 115, 22, 0.15);
        color: #f97316;
      }

      .live-dot {
        animation: pulse-dot 1.8s ease-in-out infinite;
      }

      .filter-sidebar-mobile {
        transition:
          max-height 0.35s cubic-bezier(0.16, 1, 0.3, 1),
          opacity 0.3s ease;
        overflow: hidden;
      }
      .filter-sidebar-mobile.closed {
        max-height: 0;
        opacity: 0;
      }
      .filter-sidebar-mobile.open {
        max-height: 9999px;
        opacity: 1;
      }

      ::-webkit-scrollbar {
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
    <!-- ─── Toast ──────────────────────────────────────────────── -->
    @if (toastMessage()) {
      <div
        class="toast-enter fixed top-5 right-5 z-[999] flex items-center gap-3
                  px-5 py-3.5 rounded-2xl"
        style="background:#1a1a2e;border:1px solid rgba(249,115,22,0.3);color:#fff;
                  box-shadow:0 8px 32px rgba(249,115,22,0.25);"
      >
        <span
          class="flex items-center justify-center w-7 h-7 rounded-full text-white text-base"
          style="background:linear-gradient(135deg,#f97316,#ef4444);"
          >✓</span
        >
        <span class="text-sm font-semibold">{{ toastMessage() }}</span>
      </div>
    }

    <div class="min-h-screen" style="background:#0a0a14;color:#e2e2f0;">
      <!-- ─── Hero ─────────────────────────────────────────────── -->
      <section
        class="relative overflow-hidden py-16 sm:py-20 px-4"
        style="background:linear-gradient(135deg,#0f0f1e 0%,#1a0a05 60%,#0f0f1e 100%);"
      >
        <div
          class="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-20 pointer-events-none"
          style="background:radial-gradient(circle,#f97316,transparent 70%);"
        ></div>
        <div
          class="absolute -bottom-16 -left-16 w-72 h-72 rounded-full opacity-10 pointer-events-none"
          style="background:radial-gradient(circle,#ef4444,transparent 70%);"
        ></div>

        <div class="relative max-w-7xl mx-auto">
          <div class="flex items-center gap-2 mb-4">
            <span
              class="live-dot w-2 h-2 rounded-full inline-block"
              style="background:#f97316;"
            ></span>
            <span
              class="font-bold tracking-[0.2em] text-xs uppercase"
              style="color:#f97316;"
            >
              Colección 2026
            </span>
          </div>

          <h1
            class="font-black leading-none mb-4 tracking-tight"
            style="font-size:clamp(2.5rem,7vw,5rem);
                     background:linear-gradient(135deg,#fff 40%,#f97316);
                     -webkit-background-clip:text;-webkit-text-fill-color:transparent;
                     background-clip:text;"
          >
            INTENSIFICA<br />TU JUEGO
          </h1>

          <p class="text-base max-w-md mb-8" style="color:#a0a0c0;">
            Tenis deportivos premium para llevar tu rendimiento al siguiente
            nivel.
          </p>

          <div class="flex flex-wrap gap-6">
            <div class="flex flex-col">
              <span class="text-2xl font-black" style="color:#fff;">10+</span>
              <span class="text-xs" style="color:#a0a0c0;">Modelos únicos</span>
            </div>
            <div class="w-px self-stretch" style="background:#ffffff15;"></div>
            <div class="flex flex-col">
              <span class="text-2xl font-black" style="color:#fff;">4</span>
              <span class="text-xs" style="color:#a0a0c0;">Tallas</span>
            </div>
            <div class="w-px self-stretch" style="background:#ffffff15;"></div>
            <div class="flex flex-col">
              <span class="text-2xl font-black" style="color:#fff;">3</span>
              <span class="text-xs" style="color:#a0a0c0;">Colores</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ─── Main layout ──────────────────────────────────────── -->
      <div class="max-w-7xl mx-auto px-4 py-10">
        <!-- Mobile filter toggle -->
        <div class="lg:hidden mb-4">
          <button
            (click)="filterOpen.set(!filterOpen())"
            class="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl border font-bold text-sm"
            style="background:#11111e;border-color:#ffffff0d;color:#e2e2f0;"
          >
            <span class="flex items-center gap-2">
              <svg
                class="w-4 h-4"
                style="color:#f97316;"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M3 6h18M7 12h10M11 18h2" />
              </svg>
              Filtros
              @if (activeFilterCount() > 0) {
                <span
                  class="inline-flex items-center justify-center w-5 h-5 rounded-full
                             text-xs font-black text-white"
                  style="background:linear-gradient(135deg,#f97316,#ef4444);"
                >
                  {{ activeFilterCount() }}
                </span>
              }
            </span>
            <svg
              class="w-4 h-4 transition-transform duration-300"
              [style.transform]="
                filterOpen() ? 'rotate(180deg)' : 'rotate(0deg)'
              "
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>

        <div class="flex flex-col lg:flex-row gap-8">
          <!-- ── Filters sidebar ─────────────────────────────── -->
          <aside class="lg:w-72 flex-shrink-0">
            <!-- Mobile collapsible wrapper -->
            <div
              class="lg:hidden filter-sidebar-mobile"
              [class.open]="filterOpen()"
              [class.closed]="!filterOpen()"
            >
              <div class="pb-4">
                <ng-container *ngTemplateOutlet="filtersContent"></ng-container>
              </div>
            </div>
            <!-- Desktop always visible -->
            <div class="hidden lg:block sticky top-4">
              <ng-container *ngTemplateOutlet="filtersContent"></ng-container>
            </div>
          </aside>

          <!-- ── Products grid ──────────────────────────────── -->
          <div class="flex-1 min-w-0">
            <!-- Result count + active filters -->
            <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
              <p class="text-sm" style="color:#6060a0;">
                <span class="font-black text-lg" style="color:#fff;">{{
                  products().length
                }}</span>
                &nbsp;productos encontrados
              </p>
              @if (activeFilterCount() > 0) {
                <button
                  (click)="clearFilters()"
                  class="text-xs font-bold px-3.5 py-1.5 rounded-full border transition-all"
                  style="border-color:rgba(249,115,22,0.3);color:#f97316;"
                  onmouseenter="this.style.background='rgba(249,115,22,0.08)'"
                  onmouseleave="this.style.background='transparent'"
                >
                  Limpiar filtros ({{ activeFilterCount() }})
                </button>
              }
            </div>

            <!-- Loading skeletons -->
            @if (isLoading()) {
              <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                @for (i of [1, 2, 3, 4, 5, 6]; track i) {
                  <div
                    class="rounded-3xl overflow-hidden border"
                    style="background:#11111e;border-color:#ffffff08;"
                  >
                    <div class="h-60 skeleton-shimmer"></div>
                    <div class="p-5 space-y-3">
                      <div class="h-4 rounded-lg skeleton-shimmer w-3/4"></div>
                      <div class="h-3 rounded-lg skeleton-shimmer w-1/2"></div>
                      <div class="flex gap-2">
                        <div
                          class="h-7 rounded-full skeleton-shimmer w-16"
                        ></div>
                        <div
                          class="h-7 rounded-full skeleton-shimmer w-16"
                        ></div>
                        <div
                          class="h-7 rounded-full skeleton-shimmer w-20 ml-auto"
                        ></div>
                      </div>
                      <div class="h-10 rounded-xl skeleton-shimmer"></div>
                    </div>
                  </div>
                }
              </div>
            }

            <!-- Empty state -->
            @else if (products().length === 0) {
              <div
                class="flex flex-col items-center justify-center py-28 text-center"
              >
                <div
                  class="w-24 h-24 rounded-3xl flex items-center justify-center mb-6 text-5xl"
                  style="background:linear-gradient(135deg,rgba(249,115,22,0.1),rgba(239,68,68,0.1));"
                >
                  👟
                </div>
                <h3 class="text-xl font-black mb-2" style="color:#fff;">
                  Sin resultados
                </h3>
                <p class="text-sm mb-8" style="color:#6060a0;">
                  No encontramos tenis con esos filtros.<br />Prueba con otras
                  opciones.
                </p>
                <button
                  (click)="clearFilters()"
                  class="btn-cart px-8 py-3.5 rounded-2xl font-bold text-white text-sm"
                >
                  Limpiar filtros
                </button>
              </div>
            }

            <!-- Cards grid -->
            @else {
              <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                @for (product of products(); track product.id) {
                  <article
                    class="product-card group rounded-3xl overflow-hidden border flex flex-col
                                  transition-all duration-300 cursor-pointer
                                  hover:-translate-y-1"
                    style="background:#11111e;border-color:#ffffff08;"
                    onmouseenter="this.style.borderColor='rgba(249,115,22,0.3)';
                                         this.style.boxShadow='0 16px 48px rgba(249,115,22,0.12)'"
                    onmouseleave="this.style.borderColor='rgba(255,255,255,0.031)';
                                         this.style.boxShadow='none'"
                  >
                    <!-- Image -->
                    <div
                      class="card-img-wrap relative h-60 overflow-hidden"
                      style="background:linear-gradient(135deg,#1a1a2e,#0f0f1e);"
                    >
                      <img
                        [src]="product.imageUrl"
                        [alt]="product.name"
                        loading="lazy"
                        width="400"
                        height="240"
                        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        (error)="onImageError($event)"
                      />

                      @if (product.stock === 0) {
                        <div
                          class="absolute inset-0 flex items-center justify-center"
                          style="background:rgba(0,0,0,0.65);backdrop-filter:blur(4px);"
                        >
                          <span
                            class="font-black text-sm px-5 py-2 rounded-full border"
                            style="color:#fff;border-color:rgba(255,255,255,0.4);"
                            >AGOTADO</span
                          >
                        </div>
                      }

                      @if (product.stock > 0 && product.stock <= 5) {
                        <div class="absolute top-3 left-3">
                          <span
                            class="text-xs font-black px-3 py-1.5 rounded-full"
                            style="background:linear-gradient(135deg,#ef4444,#dc2626);color:#fff;"
                          >
                            ¡Solo {{ product.stock }}!
                          </span>
                        </div>
                      }

                      <div class="absolute top-3 right-3">
                        <span
                          class="text-xs font-mono px-2.5 py-1 rounded-lg"
                          style="background:rgba(0,0,0,0.6);color:#a0a0c0;backdrop-filter:blur(8px);"
                        >
                          {{ product.code }}
                        </span>
                      </div>

                      <div class="absolute bottom-3 left-4 z-10">
                        <span
                          class="text-2xl font-black"
                          style="color:#f97316;text-shadow:0 2px 8px rgba(0,0,0,0.5);"
                        >
                          {{ product.price | currencyCop }}
                        </span>
                      </div>
                    </div>

                    <!-- Body -->
                    <div class="p-5 flex flex-col flex-1">
                      <h3
                        class="font-black text-base leading-snug mb-3"
                        style="color:#fff;"
                      >
                        {{ product.name }}
                      </h3>

                      <div class="flex flex-wrap gap-2 mb-4">
                        <span
                          class="text-xs font-bold px-3 py-1 rounded-full"
                          style="background:#ffffff0a;color:#a0a0c0;"
                        >
                          Talla {{ product.size.replace('S', '') }}
                        </span>
                        <span
                          class="text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5"
                          style="background:#ffffff0a;color:#a0a0c0;"
                        >
                          <span
                            class="w-2.5 h-2.5 rounded-full border inline-block"
                            [style]="
                              'background:' +
                              colorHex(product.color) +
                              ';border-color:' +
                              (colorHex(product.color) === '#f5f5f5'
                                ? '#ccc'
                                : 'transparent')
                            "
                          >
                          </span>
                          {{ product.color }}
                        </span>
                        <span
                          class="text-xs font-bold px-3 py-1 rounded-full ml-auto"
                          [style]="
                            product.stock > 0
                              ? 'background:rgba(34,197,94,0.1);color:#4ade80;'
                              : 'background:rgba(239,68,68,0.1);color:#f87171;'
                          "
                        >
                          {{ product.stock > 0 ? '● En stock' : '● Agotado' }}
                        </span>
                      </div>

                      <!-- Quantity selector -->
                      @if (product.stock > 0) {
                        <div class="flex items-center gap-3 mb-4">
                          <span
                            class="text-xs font-bold uppercase tracking-wider"
                            style="color:#6060a0;"
                          >
                            Cant.
                          </span>
                          <div
                            class="flex items-center rounded-xl overflow-hidden border"
                            style="border-color:#ffffff15;"
                          >
                            <button
                              (click)="decreaseQty(product.id)"
                              class="qty-btn w-9 h-9 flex items-center justify-center font-black text-lg"
                              style="color:#a0a0c0;"
                              aria-label="Reducir cantidad"
                            >
                              −
                            </button>
                            <span
                              class="w-10 h-9 flex items-center justify-center text-sm font-black border-x tabular-nums"
                              style="color:#fff;border-color:#ffffff15;"
                            >
                              {{ getQty(product.id) }}
                            </span>
                            <button
                              (click)="increaseQty(product.id, product.stock)"
                              class="qty-btn w-9 h-9 flex items-center justify-center font-black text-lg"
                              style="color:#a0a0c0;"
                              aria-label="Aumentar cantidad"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      }

                      <!-- Actions -->
                      <div class="flex gap-2 mt-auto">
                        <a
                          [routerLink]="['/catalog', product.id]"
                          class="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl
                                  text-sm font-bold border transition-all"
                          style="border-color:#ffffff20;color:#e2e2f0;"
                          onmouseenter="this.style.borderColor='rgba(255,255,255,0.35)';this.style.background='rgba(255,255,255,0.04)'"
                          onmouseleave="this.style.borderColor='rgba(255,255,255,0.125)';this.style.background='transparent'"
                        >
                          <svg
                            class="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                            />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          Ver más
                        </a>
                        @if (product.stock > 0) {
                          <button
                            (click)="addToCart(product)"
                            class="btn-cart flex-1 flex items-center justify-center gap-1.5
                                         py-2.5 rounded-xl text-sm font-bold text-white"
                          >
                            <svg
                              class="w-3.5 h-3.5"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2.5"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <circle cx="9" cy="21" r="1" />
                              <circle cx="20" cy="21" r="1" />
                              <path
                                d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
                              />
                            </svg>
                            Agregar
                          </button>
                        }
                      </div>
                    </div>
                  </article>
                }
              </div>

              <!-- Pagination -->
              @if (totalPages() > 1) {
                <div
                  class="mt-12 flex justify-center items-center gap-2 flex-wrap"
                >
                  <button
                    (click)="previousPage()"
                    [disabled]="currentPage() === 1"
                    class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold
                                 border transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    style="border-color:#ffffff15;color:#e2e2f0;"
                    onmouseenter="if(!this.disabled){this.style.borderColor='#f97316';this.style.color='#f97316';}"
                    onmouseleave="this.style.borderColor='#ffffff15';this.style.color='#e2e2f0'"
                  >
                    ← Anterior
                  </button>

                  @for (page of pageNumbers(); track page) {
                    @if (page === -1) {
                      <span class="px-2 text-sm" style="color:#6060a0;">…</span>
                    } @else {
                      <button
                        (click)="goToPage(page)"
                        class="w-10 h-10 rounded-xl text-sm font-black border transition-all"
                        [style]="
                          currentPage() === page
                            ? 'background:linear-gradient(135deg,#f97316,#ef4444);color:#fff;border-color:transparent;box-shadow:0 4px 14px rgba(249,115,22,0.4);'
                            : 'border-color:#ffffff15;color:#a0a0c0;'
                        "
                      >
                        {{ page }}
                      </button>
                    }
                  }

                  <button
                    (click)="nextPage()"
                    [disabled]="currentPage() === totalPages()"
                    class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold
                                 border transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    style="border-color:#ffffff15;color:#e2e2f0;"
                    onmouseenter="if(!this.disabled){this.style.borderColor='#f97316';this.style.color='#f97316';}"
                    onmouseleave="this.style.borderColor='#ffffff15';this.style.color='#e2e2f0'"
                  >
                    Siguiente →
                  </button>
                </div>
              }
            }
          </div>
        </div>
      </div>
    </div>

    <!-- ─── Filters template ──────────────────────────────────── -->
    <ng-template #filtersContent>
      <div
        class="rounded-3xl p-6 border"
        style="background:#11111e;border-color:#ffffff0d;"
      >
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-2">
            <svg
              class="w-4 h-4"
              style="color:#f97316;"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M3 6h18M7 12h10M11 18h2" />
            </svg>
            <h3 class="font-bold text-base" style="color:#fff;">Filtros</h3>
          </div>
          @if (activeFilterCount() > 0) {
            <button
              (click)="clearFilters()"
              class="text-xs font-bold px-3 py-1 rounded-full border transition-all"
              style="color:#f97316;border-color:rgba(249,115,22,0.3);"
              onmouseenter="this.style.background='rgba(249,115,22,0.08)'"
              onmouseleave="this.style.background='transparent'"
            >
              Limpiar
            </button>
          }
        </div>

        <!-- Search -->
        <div class="mb-6">
          <label
            class="block text-xs font-bold uppercase tracking-widest mb-2"
            style="color:#6060a0;"
            >Buscar</label
          >
          <div class="relative">
            <svg
              class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style="color:#6060a0;"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="search"
              [formControl]="searchControl"
              placeholder="Nombre, código..."
              class="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none border transition-all"
              style="background:#0a0a14;border-color:#ffffff15;color:#e2e2f0;"
              onfocus="this.style.borderColor='#f97316';this.style.boxShadow='0 0 0 3px rgba(249,115,22,0.15)'"
              onblur="this.style.borderColor='#ffffff15';this.style.boxShadow='none'"
            />
          </div>
        </div>

        <!-- Size pills -->
        <div class="mb-6">
          <label
            class="block text-xs font-bold uppercase tracking-widest mb-3"
            style="color:#6060a0;"
            >Talla</label
          >
          <div class="grid grid-cols-4 gap-2">
            @for (size of sizes; track size.value) {
              <button
                (click)="toggleSize(size.value)"
                class="py-2.5 rounded-xl text-sm font-black border-2 transition-all"
                [class.filter-pill-active]="sizeControl.value === size.value"
                [style]="
                  sizeControl.value !== size.value
                    ? 'border-color:#ffffff15;color:#a0a0c0;background:transparent'
                    : ''
                "
              >
                {{ size.label }}
              </button>
            }
          </div>
        </div>

        <!-- Color options -->
        <div class="mb-6">
          <label
            class="block text-xs font-bold uppercase tracking-widest mb-3"
            style="color:#6060a0;"
            >Color</label
          >
          <div class="flex flex-col gap-2">
            @for (color of colors; track color.value) {
              <button
                (click)="toggleColor(color.value)"
                class="flex items-center gap-3 px-4 py-2.5 rounded-xl border-2 transition-all"
                [style]="
                  colorControl.value === color.value
                    ? 'border-color:#f97316;background:rgba(249,115,22,0.08);'
                    : 'border-color:#ffffff0d;background:transparent;'
                "
              >
                <span
                  class="w-5 h-5 rounded-full border-2 flex-shrink-0"
                  [style]="
                    'background:' +
                    color.hex +
                    ';border-color:' +
                    (color.hex === '#f5f5f5' ? '#ccc' : color.hex)
                  "
                >
                </span>
                <span class="text-sm font-semibold" style="color:#e2e2f0;">{{
                  color.label
                }}</span>
                @if (colorControl.value === color.value) {
                  <svg
                    class="w-4 h-4 ml-auto"
                    style="color:#f97316;"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                }
              </button>
            }
          </div>
        </div>

        <!-- Price range -->
        <div>
          <label
            class="block text-xs font-bold uppercase tracking-widest mb-3"
            style="color:#6060a0;"
            >Precio (COP)</label
          >
          <div class="flex gap-2">
            <input
              type="number"
              [formControl]="minPriceControl"
              placeholder="Mín"
              class="w-full px-3 py-2.5 rounded-xl text-sm outline-none border transition-all"
              style="background:#0a0a14;border-color:#ffffff15;color:#e2e2f0;"
              onfocus="this.style.borderColor='#f97316'"
              onblur="this.style.borderColor='#ffffff15'"
            />
            <input
              type="number"
              [formControl]="maxPriceControl"
              placeholder="Máx"
              class="w-full px-3 py-2.5 rounded-xl text-sm outline-none border transition-all"
              style="background:#0a0a14;border-color:#ffffff15;color:#e2e2f0;"
              onfocus="this.style.borderColor='#f97316'"
              onblur="this.style.borderColor='#ffffff15'"
            />
          </div>
        </div>
      </div>
    </ng-template>
  `,
})
export class ProductListComponent implements OnDestroy {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();

  isLoading = signal(false);
  products = signal<Product[]>([]);
  currentPage = signal(1);
  totalPages = signal(1);
  toastMessage = signal('');
  quantities = signal<Record<number, number>>({});
  filterOpen = signal(false);

  searchControl = this.fb.control('');
  sizeControl = this.fb.control<ProductSize | ''>('');
  colorControl = this.fb.control<ProductColor | ''>('');
  minPriceControl = this.fb.control<number | null>(null);
  maxPriceControl = this.fb.control<number | null>(null);

  readonly sizes = [
    { value: 'S7' as ProductSize, label: '7' },
    { value: 'S8' as ProductSize, label: '8' },
    { value: 'S9' as ProductSize, label: '9' },
    { value: 'S10' as ProductSize, label: '10' },
  ];

  readonly colors = [
    { value: 'Blanco' as ProductColor, label: 'Blanco', hex: '#f5f5f5' },
    { value: 'Negro' as ProductColor, label: 'Negro', hex: '#1a1a1a' },
    { value: 'Gris' as ProductColor, label: 'Gris', hex: '#9ca3af' },
  ];

  constructor() {
    // Initial load
    this.loadProducts();

    this.searchControl.valueChanges
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe(() => {
        this.currentPage.set(1);
        this.loadProducts();
      });

    this.sizeControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.currentPage.set(1);
        this.loadProducts();
      });

    this.colorControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.currentPage.set(1);
        this.loadProducts();
      });

    this.minPriceControl.valueChanges
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe(() => {
        this.currentPage.set(1);
        this.loadProducts();
      });

    this.maxPriceControl.valueChanges
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe(() => {
        this.currentPage.set(1);
        this.loadProducts();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProducts(): void {
    this.isLoading.set(true);
    const filter: ProductFilter = {
      search: this.searchControl.value || undefined,
      size: (this.sizeControl.value as ProductSize) || undefined,
      color: (this.colorControl.value as ProductColor) || undefined,
      minPrice: this.minPriceControl.value || undefined,
      maxPrice: this.maxPriceControl.value || undefined,
      page: this.currentPage(),
      pageSize: 12,
    };
    this.productService.getAll(filter).subscribe({
      next: (response) => {
        if (response.data) {
          this.products.set(response.data.items);
          this.totalPages.set(response.data.totalPages);
        }
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  toggleSize(value: ProductSize): void {
    this.sizeControl.setValue(this.sizeControl.value === value ? '' : value);
  }

  toggleColor(value: ProductColor): void {
    this.colorControl.setValue(this.colorControl.value === value ? '' : value);
  }

  clearFilters(): void {
    this.searchControl.reset('', { emitEvent: false });
    this.sizeControl.setValue('', { emitEvent: false });
    this.colorControl.setValue('', { emitEvent: false });
    this.minPriceControl.reset(null, { emitEvent: false });
    this.maxPriceControl.reset(null, { emitEvent: false });
    this.currentPage.set(1);
    this.loadProducts();
  }

  activeFilterCount = computed(() => {
    let count = 0;
    if (this.searchControl.value) count++;
    if (this.sizeControl.value) count++;
    if (this.colorControl.value) count++;
    if (this.minPriceControl.value) count++;
    if (this.maxPriceControl.value) count++;
    return count;
  });

  pageNumbers(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages: number[] = [1];
    if (current > 3) pages.push(-1);
    for (
      let i = Math.max(2, current - 1);
      i <= Math.min(total - 1, current + 1);
      i++
    ) {
      pages.push(i);
    }
    if (current < total - 2) pages.push(-1);
    pages.push(total);
    return pages;
  }

  goToPage(page: number): void {
    if (page === this.currentPage()) return;
    this.currentPage.set(page);
    this.loadProducts();
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((p) => p + 1);
      this.loadProducts();
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((p) => p - 1);
      this.loadProducts();
    }
  }

  getQty(productId: number): number {
    return this.quantities()[productId] ?? 1;
  }

  increaseQty(productId: number, stock: number): void {
    const c = this.getQty(productId);
    if (c < stock)
      this.quantities.update((q) => ({ ...q, [productId]: c + 1 }));
  }

  decreaseQty(productId: number): void {
    const c = this.getQty(productId);
    if (c > 1) this.quantities.update((q) => ({ ...q, [productId]: c - 1 }));
  }

  colorHex(color: string): string {
    const map: Record<string, string> = {
      Blanco: '#f5f5f5',
      Negro: '#1a1a1a',
      Gris: '#9ca3af',
    };
    return map[color] ?? '#ccc';
  }

  addToCart(product: Product): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    const qty = this.getQty(product.id);
    this.cartService.addItem({
      productId: product.id,
      productName: product.name,
      productCode: product.code,
      size: product.size,
      color: product.color,
      unitPrice: product.price,
      quantity: qty,
      imageUrl: product.imageUrl,
    });
    this.quantities.update((q) => ({ ...q, [product.id]: 1 }));
    this.showToast(`"${product.name}" agregado al carrito`);
  }

  private showToast(message: string): void {
    this.toastMessage.set(message);
    setTimeout(() => this.toastMessage.set(''), 3000);
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src =
      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="240"%3E%3Crect fill="%231a1a2e" width="400" height="240"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="13" fill="%236060a0"%3EImagen no disponible%3C/text%3E%3C/svg%3E';
  }
}
