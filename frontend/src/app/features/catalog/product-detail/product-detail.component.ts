import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { Product } from '../../../core/models';
import { CurrencyCopPipe } from '../../../shared/pipes/currency-cop.pipe';

@Component({
  selector: 'app-product-detail',
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

      .detail-enter {
        animation: fadeInUp 0.45s ease both;
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

      .qty-btn {
        transition:
          background 0.15s,
          color 0.15s;
      }
      .qty-btn:hover {
        background: rgba(249, 115, 22, 0.15);
        color: #f97316;
      }

      .img-zoom {
        transition: transform 0.7s ease;
      }
      .img-zoom:hover {
        transform: scale(1.04);
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
                  border px-5 py-3.5 rounded-2xl"
        style="background:#1a1a2e;border-color:rgba(249,115,22,0.3);color:#fff;
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
      <!-- ─── Loading skeleton ─────────────────────────────────── -->
      @if (isLoading()) {
        <div class="max-w-6xl mx-auto px-4 py-16">
          <!-- breadcrumb skeleton -->
          <div class="h-4 skeleton-shimmer rounded-lg w-48 mb-10"></div>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div class="aspect-square skeleton-shimmer rounded-3xl"></div>
            <div class="space-y-5 pt-2">
              <div class="h-3 skeleton-shimmer rounded-lg w-24"></div>
              <div class="h-9 skeleton-shimmer rounded-xl w-3/4"></div>
              <div class="h-5 skeleton-shimmer rounded-lg w-1/3"></div>
              <div class="h-14 skeleton-shimmer rounded-xl w-1/2"></div>
              <div class="h-24 skeleton-shimmer rounded-2xl"></div>
              <div class="grid grid-cols-2 gap-3">
                <div class="h-20 skeleton-shimmer rounded-2xl"></div>
                <div class="h-20 skeleton-shimmer rounded-2xl"></div>
                <div class="h-16 skeleton-shimmer rounded-2xl col-span-2"></div>
              </div>
              <div class="h-14 skeleton-shimmer rounded-2xl"></div>
            </div>
          </div>
        </div>
      }

      <!-- ─── Product found ─────────────────────────────────────── -->
      @else if (product()) {
        <!-- Breadcrumb -->
        <nav
          class="border-b px-4 py-3"
          style="border-color:#ffffff08;background:#11111e;"
        >
          <div class="max-w-6xl mx-auto flex items-center gap-2 text-sm">
            <a
              routerLink="/catalog"
              class="font-medium transition-colors"
              style="color:#6060a0;"
              onmouseenter="this.style.color='#f97316'"
              onmouseleave="this.style.color='#6060a0'"
            >
              Catálogo
            </a>
            <span style="color:#f97316;">›</span>
            <span
              class="font-semibold truncate max-w-xs"
              style="color:#e2e2f0;"
            >
              {{ product()!.name }}
            </span>
          </div>
        </nav>

        <!-- Main content -->
        <div class="max-w-6xl mx-auto px-4 py-10">
          <div class="detail-enter grid grid-cols-1 lg:grid-cols-2 gap-12">
            <!-- ── Image panel ──────────────────────────────────── -->
            <div class="relative">
              <div
                class="relative rounded-3xl overflow-hidden aspect-square border"
                style="background:linear-gradient(135deg,#1a1a2e,#0f0f1e);border-color:#ffffff08;"
              >
                <img
                  [src]="product()!.imageUrl"
                  [alt]="product()!.name"
                  width="600"
                  height="600"
                  loading="lazy"
                  class="img-zoom w-full h-full object-cover"
                  (error)="onImageError($event)"
                />

                <!-- gradient overlay -->
                <div
                  class="absolute inset-0 pointer-events-none"
                  style="background:linear-gradient(to top,rgba(0,0,0,0.45) 0%,transparent 55%);"
                ></div>

                <!-- Out of stock -->
                @if (product()!.stock === 0) {
                  <div
                    class="absolute inset-0 flex items-center justify-center"
                    style="background:rgba(0,0,0,0.65);backdrop-filter:blur(4px);"
                  >
                    <span
                      class="font-black text-base px-6 py-2.5 rounded-full border"
                      style="color:#fff;border-color:rgba(255,255,255,0.35);"
                    >
                      AGOTADO
                    </span>
                  </div>
                }

                <!-- Low stock badge -->
                @if (product()!.stock > 0 && product()!.stock <= 5) {
                  <div class="absolute top-4 left-4">
                    <span
                      class="text-xs font-black px-3 py-1.5 rounded-full"
                      style="background:linear-gradient(135deg,#ef4444,#dc2626);color:#fff;"
                    >
                      ¡Solo {{ product()!.stock }} disponibles!
                    </span>
                  </div>
                }

                <!-- Code badge top-right -->
                <div class="absolute top-4 right-4">
                  <span
                    class="text-xs font-mono px-2.5 py-1 rounded-lg"
                    style="background:rgba(0,0,0,0.6);color:#a0a0c0;backdrop-filter:blur(8px);"
                  >
                    {{ product()!.code }}
                  </span>
                </div>
              </div>
            </div>

            <!-- ── Info panel ───────────────────────────────────── -->
            <div class="flex flex-col">
              <!-- Name & status -->
              <div class="mb-6">
                <h1
                  class="text-4xl font-black leading-tight mb-3 tracking-tight"
                  style="color:#fff;"
                >
                  {{ product()!.name }}
                </h1>
                <div class="flex items-center gap-2 flex-wrap">
                  <span
                    class="text-xs font-bold px-3 py-1.5 rounded-full"
                    [style]="
                      product()!.stock > 0
                        ? 'background:rgba(34,197,94,0.1);color:#4ade80;'
                        : 'background:rgba(239,68,68,0.1);color:#f87171;'
                    "
                  >
                    {{ product()!.stock > 0 ? '● En stock' : '● Agotado' }}
                  </span>
                </div>
              </div>

              <!-- Price -->
              <div class="mb-6">
                <p class="text-5xl font-black" style="color:#f97316;">
                  {{ product()!.price | currencyCop }}
                </p>
                <p
                  class="text-sm mt-1.5 flex items-center gap-1.5"
                  style="color:#6060a0;"
                >
                  <svg
                    class="w-4 h-4"
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
                  Pago contra entrega
                </p>
              </div>

              <!-- Description -->
              <div
                class="rounded-2xl px-5 py-4 mb-6 border"
                style="background:#ffffff05;border-color:#ffffff08;"
              >
                <p class="text-sm leading-relaxed" style="color:#a0a0c0;">
                  {{ product()!.description }}
                </p>
              </div>

              <!-- Specs grid -->
              <div class="grid grid-cols-2 gap-3 mb-6">
                <div
                  class="rounded-2xl p-4 border"
                  style="background:#ffffff05;border-color:#ffffff08;"
                >
                  <p
                    class="text-xs font-bold uppercase tracking-widest mb-2"
                    style="color:#6060a0;"
                  >
                    Talla
                  </p>
                  <p class="text-2xl font-black" style="color:#fff;">
                    {{ product()!.size.replace('S', '') }}
                  </p>
                </div>
                <div
                  class="rounded-2xl p-4 border"
                  style="background:#ffffff05;border-color:#ffffff08;"
                >
                  <p
                    class="text-xs font-bold uppercase tracking-widest mb-2"
                    style="color:#6060a0;"
                  >
                    Color
                  </p>
                  <div class="flex items-center gap-2 mt-1">
                    <span
                      class="w-5 h-5 rounded-full border-2 flex-shrink-0"
                      [style]="
                        'background:' +
                        colorHex(product()!.color) +
                        ';border-color:' +
                        (colorHex(product()!.color) === '#f5f5f5'
                          ? '#ccc'
                          : 'transparent')
                      "
                    >
                    </span>
                    <p class="text-base font-black" style="color:#e2e2f0;">
                      {{ product()!.color }}
                    </p>
                  </div>
                </div>
                <div
                  class="rounded-2xl p-4 border col-span-2"
                  style="background:#ffffff05;border-color:#ffffff08;"
                >
                  <p
                    class="text-xs font-bold uppercase tracking-widest mb-1"
                    style="color:#6060a0;"
                  >
                    Stock disponible
                  </p>
                  <p class="text-lg font-black" style="color:#e2e2f0;">
                    {{ product()!.stock }} unidades
                  </p>
                </div>
              </div>

              <!-- Add to cart form -->
              <form [formGroup]="form" (ngSubmit)="onAddToCart()">
                <!-- Quantity selector -->
                @if (product()!.stock > 0) {
                  <div class="mb-5">
                    <label
                      class="block text-xs font-bold uppercase tracking-widest mb-3"
                      style="color:#6060a0;"
                      >Cantidad</label
                    >
                    <div class="flex items-center gap-4">
                      <div
                        class="flex items-center rounded-xl overflow-hidden border"
                        style="border-color:#ffffff15;"
                      >
                        <button
                          type="button"
                          (click)="decreaseQty()"
                          class="qty-btn w-11 h-11 flex items-center justify-center font-black text-xl"
                          style="color:#a0a0c0;"
                        >
                          −
                        </button>
                        <span
                          class="w-12 h-11 flex items-center justify-center text-base font-black border-x"
                          style="color:#fff;border-color:#ffffff15;"
                        >
                          {{ form.get('quantity')!.value }}
                        </span>
                        <button
                          type="button"
                          (click)="increaseQty()"
                          class="qty-btn w-11 h-11 flex items-center justify-center font-black text-xl"
                          style="color:#a0a0c0;"
                        >
                          +
                        </button>
                      </div>
                      <span class="text-xs font-bold" style="color:#6060a0;">
                        Máx. {{ product()!.stock }}
                      </span>
                    </div>
                  </div>
                }

                <!-- Login warning -->
                @if (!authService.isLoggedIn()) {
                  <div
                    class="flex items-start gap-3 px-4 py-3.5 rounded-xl mb-4 border"
                    style="background:rgba(249,115,22,0.06);border-color:rgba(249,115,22,0.25);"
                  >
                    <svg
                      class="w-4 h-4 mt-0.5 flex-shrink-0"
                      style="color:#f97316;"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <p class="text-sm" style="color:#a0a0c0;">
                      Debes
                      <a
                        routerLink="/login"
                        class="font-black transition-colors"
                        style="color:#f97316;"
                        onmouseenter="this.style.textDecoration='underline'"
                        onmouseleave="this.style.textDecoration='none'"
                      >
                        iniciar sesión
                      </a>
                      para agregar productos al carrito.
                    </p>
                  </div>
                }

                <!-- CTA -->
                <button
                  type="submit"
                  [disabled]="
                    !authService.isLoggedIn() ||
                    product()!.stock === 0 ||
                    saving()
                  "
                  class="btn-primary w-full flex items-center justify-center gap-2.5
                               py-4 rounded-2xl font-black text-white text-base mb-3"
                >
                  @if (product()!.stock === 0) {
                    Sin stock disponible
                  } @else if (!authService.isLoggedIn()) {
                    Inicia sesión para comprar
                  } @else if (saving()) {
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
                    Agregando...
                  } @else {
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="9" cy="21" r="1" />
                      <circle cx="20" cy="21" r="1" />
                      <path
                        d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
                      />
                    </svg>
                    Agregar al carrito
                  }
                </button>

                <!-- Back link -->
                <a
                  routerLink="/catalog"
                  class="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl
                          font-bold text-sm border transition-all"
                  style="border-color:#ffffff20;color:#a0a0c0;"
                  onmouseenter="this.style.borderColor='#f97316';this.style.color='#f97316'"
                  onmouseleave="this.style.borderColor='#ffffff20';this.style.color='#a0a0c0'"
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
              </form>
            </div>
          </div>
        </div>
      }

      <!-- ─── Product not found ────────────────────────────────── -->
      @else {
        <div
          class="flex flex-col items-center justify-center py-28 text-center px-4"
        >
          <div
            class="w-24 h-24 rounded-3xl flex items-center justify-center mb-6 text-5xl"
            style="background:linear-gradient(135deg,#f9731615,#ef444415);"
          >
            👟
          </div>
          <h2 class="text-2xl font-black mb-2" style="color:#fff;">
            Producto no encontrado
          </h2>
          <p class="text-sm mb-8" style="color:#6060a0;">
            Este producto no existe o fue eliminado del catálogo.
          </p>
          <a
            routerLink="/catalog"
            class="btn-primary px-8 py-3.5 rounded-2xl font-bold text-white text-sm inline-block"
          >
            Volver al catálogo
          </a>
        </div>
      }
    </div>
  `,
})
export class ProductDetailComponent {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  product = signal<Product | null>(null);
  isLoading = signal(false);
  saving = signal(false);
  toastMessage = signal('');

  form = this.fb.group({
    quantity: [1, [Validators.required, Validators.min(1)]],
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadProduct(+id);
  }

  private loadProduct(id: number): void {
    this.isLoading.set(true);
    this.productService.getById(id).subscribe({
      next: (res) => {
        if (res.data) this.product.set(res.data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  increaseQty() {
    const current = this.form.get('quantity')!.value ?? 1;
    const max = this.product()?.stock ?? 1;
    if (current < max) this.form.patchValue({ quantity: current + 1 });
  }

  decreaseQty() {
    const current = this.form.get('quantity')!.value ?? 1;
    if (current > 1) this.form.patchValue({ quantity: current - 1 });
  }

  colorHex(color: string): string {
    const map: Record<string, string> = {
      Blanco: '#f5f5f5',
      Negro: '#1a1a1a',
      Gris: '#9ca3af',
    };
    return map[color] ?? '#ccc';
  }

  onAddToCart(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    if (!this.form.valid) return;
    const product = this.product();
    if (!product) return;

    this.saving.set(true);
    const quantity = this.form.get('quantity')!.value ?? 1;
    this.cartService.addItem({
      productId: product.id,
      productName: product.name,
      productCode: product.code,
      size: product.size,
      color: product.color,
      unitPrice: product.price,
      quantity,
      imageUrl: product.imageUrl,
    });
    this.showToast(`"${product.name}" agregado al carrito ✓`);
    setTimeout(() => {
      this.saving.set(false);
      this.router.navigate(['/cart']);
    }, 1200);
  }

  private showToast(message: string) {
    this.toastMessage.set(message);
    setTimeout(() => this.toastMessage.set(''), 3000);
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src =
      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="600"%3E%3Crect fill="%231a1a2e" width="600" height="600"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="16" fill="%236060a0"%3EImagen no disponible%3C/text%3E%3C/svg%3E';
  }
}
