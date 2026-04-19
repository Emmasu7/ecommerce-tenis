import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CartService } from '../../../core/services/cart.service';
import { OrderService } from '../../../core/services/order.service';
import { CreateOrderRequest } from '../../../core/models';
import { CurrencyCopPipe } from '../../../shared/pipes/currency-cop.pipe';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, CurrencyCopPipe],
  styles: [
    `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(16px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(32px) scale(0.97);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      .cart-row {
        animation: fadeInUp 0.35s ease both;
      }
      .cart-row:nth-child(2) {
        animation-delay: 0.05s;
      }
      .cart-row:nth-child(3) {
        animation-delay: 0.1s;
      }
      .cart-row:nth-child(4) {
        animation-delay: 0.15s;
      }
      .cart-row:nth-child(5) {
        animation-delay: 0.2s;
      }

      .modal-panel {
        animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
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

      .qty-btn {
        transition:
          background 0.15s,
          color 0.15s;
      }
      .qty-btn:hover {
        background: rgba(249, 115, 22, 0.15);
        color: #f97316;
      }

      input:focus,
      textarea:focus {
        outline: none;
        border-color: #f97316 !important;
        box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.15);
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
    <div class="min-h-screen" style="background:#0a0a14; color:#e2e2f0;">
      <!-- ─── Header ────────────────────────────────────────────── -->
      <header
        class="relative overflow-hidden py-14 px-4"
        style="background:linear-gradient(135deg,#0f0f1e 0%,#1a0a05 60%,#0f0f1e 100%);"
      >
        <div
          class="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20 pointer-events-none"
          style="background:radial-gradient(circle,#f97316,transparent 70%);"
        ></div>
        <div
          class="relative max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4"
        >
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span
                class="w-2 h-2 rounded-full bg-orange-500 inline-block"
              ></span>
              <span
                class="text-orange-400 font-bold tracking-[0.2em] text-xs uppercase"
              >
                Tu selección
              </span>
            </div>
            <h1
              class="text-4xl sm:text-5xl font-black leading-none tracking-tight"
              style="background:linear-gradient(135deg,#fff 40%,#f97316);
                       -webkit-background-clip:text;-webkit-text-fill-color:transparent;"
            >
              Carrito
            </h1>
            <p class="mt-2 text-sm" style="color:#a0a0c0;">
              <span class="font-black text-white text-base">{{
                cartService.totalItems()
              }}</span>
              &nbsp;producto(s) seleccionado(s)
            </p>
          </div>
          <a
            routerLink="/catalog"
            class="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border transition-all"
            style="border-color:#ffffff20;color:#e2e2f0;"
            onmouseenter="this.style.borderColor='#f97316';this.style.color='#f97316'"
            onmouseleave="this.style.borderColor='#ffffff20';this.style.color='#e2e2f0'"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Seguir comprando
          </a>
        </div>
      </header>

      <div class="max-w-7xl mx-auto px-4 py-10">
        <!-- ─── Empty state ──────────────────────────────────────── -->
        @if (cartService.items().length === 0) {
          <div
            class="flex flex-col items-center justify-center py-28 text-center"
          >
            <div
              class="w-28 h-28 rounded-3xl flex items-center justify-center mb-6 text-5xl"
              style="background:linear-gradient(135deg,#f9731615,#ef444415);"
            >
              🛒
            </div>
            <h2 class="text-2xl font-black text-white mb-2">
              Tu carrito está vacío
            </h2>
            <p class="text-sm mb-8" style="color:#6060a0;">
              Agrega productos desde el catálogo para comenzar
            </p>
            <a
              routerLink="/catalog"
              class="btn-primary px-8 py-3.5 rounded-2xl font-bold text-white text-sm inline-block"
            >
              Ver catálogo
            </a>
          </div>
        }

        <!-- ─── Cart content ─────────────────────────────────────── -->
        @else {
          <div class="flex flex-col lg:flex-row gap-8">
            <!-- Items table -->
            <div class="flex-1 min-w-0">
              <div
                class="rounded-3xl overflow-hidden border"
                style="background:#11111e;border-color:#ffffff08;"
              >
                <!-- Table header -->
                <div
                  class="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b text-xs font-bold uppercase tracking-widest"
                  style="background:#ffffff05;border-color:#ffffff08;color:#6060a0;"
                >
                  <div class="col-span-5">Producto</div>
                  <div class="col-span-2 text-center">Precio unit.</div>
                  <div class="col-span-2 text-center">Cantidad</div>
                  <div class="col-span-2 text-center">Subtotal</div>
                  <div class="col-span-1"></div>
                </div>

                <!-- Rows -->
                <div>
                  @for (item of cartService.items(); track item.productId) {
                    <div
                      class="cart-row grid grid-cols-12 gap-4 px-6 py-5 items-center border-b transition-colors"
                      style="border-color:#ffffff06;"
                      onmouseenter="this.style.background='#ffffff04'"
                      onmouseleave="this.style.background='transparent'"
                    >
                      <!-- Product info -->
                      <div
                        class="col-span-12 md:col-span-5 flex items-center gap-4"
                      >
                        <div
                          class="w-16 h-16 flex-shrink-0 rounded-2xl overflow-hidden border"
                          style="background:linear-gradient(135deg,#1a1a2e,#0f0f1e);border-color:#ffffff10;"
                        >
                          <img
                            [src]="item.imageUrl"
                            [alt]="item.productName"
                            class="w-full h-full object-cover"
                            (error)="onImageError($event)"
                          />
                        </div>
                        <div>
                          <p
                            class="font-black text-sm leading-tight"
                            style="color:#e2e2f0;"
                          >
                            {{ item.productName }}
                          </p>
                          <p
                            class="text-xs font-mono mt-0.5"
                            style="color:#6060a0;"
                          >
                            {{ item.productCode }}
                          </p>
                          <div class="flex flex-wrap gap-1.5 mt-2">
                            <span
                              class="text-xs font-bold px-2.5 py-0.5 rounded-full"
                              style="background:#ffffff0a;color:#a0a0c0;"
                            >
                              Talla {{ item.size.replace('S', '') }}
                            </span>
                            <span
                              class="text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5"
                              style="background:#ffffff0a;color:#a0a0c0;"
                            >
                              <span
                                class="w-2.5 h-2.5 rounded-full inline-block border"
                                [style]="
                                  'background:' +
                                  colorHex(item.color) +
                                  ';border-color:' +
                                  (colorHex(item.color) === '#f5f5f5'
                                    ? '#ccc'
                                    : 'transparent')
                                "
                              >
                              </span>
                              {{ item.color }}
                            </span>
                          </div>
                        </div>
                      </div>

                      <!-- Unit price -->
                      <div class="col-span-4 md:col-span-2 text-center">
                        <p
                          class="text-xs mb-1 md:hidden"
                          style="color:#6060a0;"
                        >
                          Precio unit.
                        </p>
                        <p class="text-sm font-bold" style="color:#a0a0c0;">
                          {{ item.unitPrice | currencyCop }}
                        </p>
                      </div>

                      <!-- Quantity -->
                      <div class="col-span-4 md:col-span-2 flex justify-center">
                        <div
                          class="flex items-center rounded-xl overflow-hidden border"
                          style="border-color:#ffffff15;"
                        >
                          <button
                            (click)="decreaseQty(item.productId)"
                            class="qty-btn w-9 h-9 flex items-center justify-center font-black text-lg"
                            style="color:#a0a0c0;"
                          >
                            −
                          </button>
                          <span
                            class="w-10 h-9 flex items-center justify-center text-sm font-black border-x"
                            style="color:#e2e2f0;border-color:#ffffff15;"
                          >
                            {{ item.quantity }}
                          </span>
                          <button
                            (click)="increaseQty(item.productId)"
                            class="qty-btn w-9 h-9 flex items-center justify-center font-black text-lg"
                            style="color:#a0a0c0;"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <!-- Subtotal -->
                      <div class="col-span-3 md:col-span-2 text-center">
                        <p
                          class="text-xs mb-1 md:hidden"
                          style="color:#6060a0;"
                        >
                          Subtotal
                        </p>
                        <p class="text-sm font-black" style="color:#f97316;">
                          {{ item.unitPrice * item.quantity | currencyCop }}
                        </p>
                      </div>

                      <!-- Delete -->
                      <div class="col-span-1 flex justify-center">
                        <button
                          (click)="cartService.removeItem(item.productId)"
                          class="w-8 h-8 flex items-center justify-center rounded-xl border transition-all"
                          style="border-color:#ffffff10;color:#6060a0;"
                          onmouseenter="this.style.borderColor='rgba(239,68,68,0.4)';this.style.color='#f87171';this.style.background='rgba(239,68,68,0.08)'"
                          onmouseleave="this.style.borderColor='#ffffff10';this.style.color='#6060a0';this.style.background='transparent'"
                        >
                          <svg
                            class="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2.5"
                            viewBox="0 0 24 24"
                          >
                            <path d="M18 6 6 18M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  }
                </div>
              </div>

              <!-- Clear cart -->
              <div class="mt-4 flex justify-end">
                <button
                  (click)="clearCart()"
                  class="flex items-center gap-2 text-sm font-bold transition-colors px-4 py-2 rounded-xl"
                  style="color:#6060a0;"
                  onmouseenter="this.style.color='#f87171';this.style.background='rgba(239,68,68,0.06)'"
                  onmouseleave="this.style.color='#6060a0';this.style.background='transparent'"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path
                      d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"
                    />
                  </svg>
                  Vaciar carrito
                </button>
              </div>
            </div>

            <!-- ── Order summary ──────────────────────────────────── -->
            <div class="lg:w-80 flex-shrink-0">
              <div
                class="sticky top-4 rounded-3xl p-6 border"
                style="background:#11111e;border-color:#ffffff0d;"
              >
                <h2
                  class="font-black text-base text-white mb-5 flex items-center gap-2"
                >
                  <svg
                    class="w-4 h-4"
                    style="color:#f97316;"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"
                    />
                    <rect x="9" y="3" width="6" height="4" rx="1" />
                  </svg>
                  Resumen del pedido
                </h2>

                <div class="space-y-3 mb-5">
                  @for (item of cartService.items(); track item.productId) {
                    <div
                      class="flex justify-between items-center text-sm gap-2"
                    >
                      <span class="truncate" style="color:#a0a0c0;">
                        {{ item.productName }}
                        <span class="font-black" style="color:#6060a0;"
                          >×{{ item.quantity }}</span
                        >
                      </span>
                      <span
                        class="font-bold flex-shrink-0"
                        style="color:#e2e2f0;"
                      >
                        {{ item.unitPrice * item.quantity | currencyCop }}
                      </span>
                    </div>
                  }
                </div>

                <div
                  class="border-t pt-4 mb-5 space-y-3"
                  style="border-color:#ffffff08;"
                >
                  <div class="flex justify-between items-center text-sm">
                    <span style="color:#6060a0;">Total artículos</span>
                    <span class="font-bold text-white">{{
                      cartService.totalItems()
                    }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="font-bold text-white text-sm">Total</span>
                    <span class="text-2xl font-black" style="color:#f97316;">
                      {{ cartService.totalAmount() | currencyCop }}
                    </span>
                  </div>
                </div>

                <!-- Shipping notice -->
                <div
                  class="flex items-center gap-3 px-4 py-3 rounded-2xl mb-5 border"
                  style="background:rgba(249,115,22,0.06);border-color:rgba(249,115,22,0.2);"
                >
                  <svg
                    class="w-5 h-5 flex-shrink-0"
                    style="color:#f97316;"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                  >
                    <rect x="1" y="3" width="15" height="13" rx="1" />
                    <path
                      d="M16 8h4l3 5v3h-7V8zM5.5 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM19.5 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"
                    />
                  </svg>
                  <p class="text-xs font-semibold" style="color:#f97316;">
                    Pago contra entrega — Envío sin costo adicional
                  </p>
                </div>

                <button
                  (click)="openCheckoutModal()"
                  [disabled]="isLoading()"
                  class="btn-primary w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-white text-base disabled:opacity-50"
                >
                  @if (isLoading()) {
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
                    Procesando...
                  } @else {
                    Finalizar compra
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  }
                </button>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- ─── Checkout Modal ────────────────────────────────────── -->
      @if (showCheckoutModal()) {
        <div
          class="fixed inset-0 flex items-center justify-center z-50 px-4"
          style="background:rgba(0,0,0,0.75);backdrop-filter:blur(6px);"
        >
          <div
            class="modal-panel w-full max-w-md rounded-3xl p-8 border shadow-[0_32px_80px_rgba(0,0,0,0.6)]"
            style="background:#0f0f1e;border-color:#ffffff10;"
          >
            <!-- Modal header -->
            <div class="flex items-center justify-between mb-6">
              <div>
                <h2 class="text-2xl font-black text-white">Confirmar compra</h2>
                <p class="text-xs mt-1" style="color:#6060a0;">
                  Revisa tu pedido antes de confirmar
                </p>
              </div>
              <button
                (click)="closeCheckoutModal()"
                class="w-9 h-9 flex items-center justify-center rounded-xl border transition-all"
                style="border-color:#ffffff15;color:#a0a0c0;"
                onmouseenter="this.style.borderColor='#ffffff30';this.style.color='#fff'"
                onmouseleave="this.style.borderColor='#ffffff15';this.style.color='#a0a0c0'"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Summary in modal -->
            <div
              class="rounded-2xl p-4 mb-5 border"
              style="background:#ffffff05;border-color:#ffffff08;"
            >
              <p
                class="text-xs font-bold uppercase tracking-widest mb-3"
                style="color:#6060a0;"
              >
                Resumen
              </p>
              <div class="space-y-2">
                @for (item of cartService.items(); track item.productId) {
                  <div class="flex justify-between text-sm">
                    <span style="color:#a0a0c0;">
                      {{ item.productName }}
                      <span class="font-black" style="color:#6060a0;"
                        >×{{ item.quantity }}</span
                      >
                    </span>
                    <span class="font-bold" style="color:#e2e2f0;">
                      {{ item.unitPrice * item.quantity | currencyCop }}
                    </span>
                  </div>
                }
              </div>
              <div
                class="border-t mt-3 pt-3 flex justify-between items-center"
                style="border-color:#ffffff08;"
              >
                <span class="font-bold text-white text-sm">Total</span>
                <span class="font-black text-lg" style="color:#f97316;">
                  {{ cartService.totalAmount() | currencyCop }}
                </span>
              </div>
            </div>

            <!-- Error banner -->
            @if (checkoutError()) {
              <div
                class="flex items-center gap-3 px-4 py-3 rounded-xl mb-4 border text-sm"
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
                {{ checkoutError() }}
              </div>
            }

            <!-- Form -->
            <form
              [formGroup]="checkoutForm"
              (ngSubmit)="submitCheckout()"
              class="space-y-4"
            >
              <div>
                <label
                  class="block text-xs font-bold uppercase tracking-widest mb-2"
                  style="color:#6060a0;"
                >
                  Dirección de envío *
                </label>
                <textarea
                  formControlName="shippingAddress"
                  rows="3"
                  placeholder="Ej: Calle 13a # 71a-49, Apto 302, Medellín"
                  class="w-full px-4 py-3 rounded-xl text-sm border transition-all resize-none"
                  style="background:#0a0a14;border-color:#ffffff15;color:#e2e2f0;"
                >
                </textarea>
                @if (
                  checkoutForm.get('shippingAddress')?.invalid &&
                  checkoutForm.get('shippingAddress')?.touched
                ) {
                  <p
                    class="text-xs mt-1.5 flex items-center gap-1"
                    style="color:#f87171;"
                  >
                    <svg
                      class="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    Ingresa una dirección válida (mínimo 10 caracteres)
                  </p>
                }
              </div>

              <div class="flex gap-3 pt-2">
                <button
                  type="button"
                  (click)="closeCheckoutModal()"
                  class="flex-1 py-3 rounded-2xl font-bold text-sm border transition-all"
                  style="border-color:#ffffff20;color:#a0a0c0;"
                  onmouseenter="this.style.borderColor='#ffffff40';this.style.color='#fff';this.style.background='#ffffff08'"
                  onmouseleave="this.style.borderColor='#ffffff20';this.style.color='#a0a0c0';this.style.background='transparent'"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  [disabled]="checkoutForm.invalid || isLoading()"
                  class="btn-primary flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-white text-sm disabled:opacity-50"
                >
                  @if (isLoading()) {
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
                    Procesando...
                  } @else {
                    Confirmar pedido
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
})
export class CartComponent {
  cartService = inject(CartService);
  private orderService = inject(OrderService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  showCheckoutModal = signal(false);
  isLoading = signal(false);
  checkoutError = signal('');

  checkoutForm = this.fb.group({
    shippingAddress: ['', [Validators.required, Validators.minLength(10)]],
  });

  openCheckoutModal(): void {
    const stored = localStorage.getItem('userAddress');
    if (stored) this.checkoutForm.patchValue({ shippingAddress: stored });
    this.showCheckoutModal.set(true);
  }

  closeCheckoutModal(): void {
    this.showCheckoutModal.set(false);
    this.checkoutError.set('');
  }

  submitCheckout(): void {
    if (this.checkoutForm.invalid) return;
    this.isLoading.set(true);
    this.checkoutError.set('');
    const shippingAddress = this.checkoutForm.get('shippingAddress')!.value!;
    const orderRequest: CreateOrderRequest = {
      shippingAddress,
      items: this.cartService
        .items()
        .map((i) => ({ productId: i.productId, quantity: i.quantity })),
    };
    this.orderService.create(orderRequest).subscribe({
      next: () => {
        localStorage.setItem('userAddress', shippingAddress);
        this.cartService.clearCart();
        this.isLoading.set(false);
        this.router.navigate(['/my-orders']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.checkoutError.set(
          err.error?.detail ?? err.error?.message ?? 'Error al crear la orden',
        );
      },
    });
  }

  increaseQty(productId: number) {
    const item = this.cartService
      .items()
      .find((i) => i.productId === productId);
    if (item) this.cartService.updateQuantity(productId, item.quantity + 1);
  }

  decreaseQty(productId: number) {
    const item = this.cartService
      .items()
      .find((i) => i.productId === productId);
    if (item && item.quantity > 1)
      this.cartService.updateQuantity(productId, item.quantity - 1);
  }

  clearCart() {
    if (confirm('¿Vaciar el carrito?')) this.cartService.clearCart();
  }

  colorHex(color: string): string {
    const map: Record<string, string> = {
      Blanco: '#f5f5f5',
      Negro: '#1a1a1a',
      Gris: '#9ca3af',
    };
    return map[color] ?? '#ccc';
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src =
      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect fill="%231a1a2e" width="64" height="64"/%3E%3C/svg%3E';
  }
}
