import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav
      class="sticky top-0 z-50 border-b transition-shadow"
      style="background:rgba(10,10,20,0.92);border-color:#ffffff08;backdrop-filter:blur(16px);"
      [style.box-shadow]="scrolled() ? '0 4px 32px rgba(0,0,0,0.5)' : 'none'"
    >
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <a
            routerLink="/"
            class="flex items-center gap-3 flex-shrink-0"
            aria-label="RunZone inicio"
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
            <div class="flex flex-col leading-none">
              <span class="text-lg font-black tracking-tight text-white"
                >RunZone</span
              >
              <span
                class="text-xs font-medium tracking-widest uppercase"
                style="color:#f97316"
                >Tenis Deportivos</span
              >
            </div>
          </a>

          <!-- Desktop nav -->
          <div class="hidden md:flex items-center gap-6">
            @if (!authService.isLoggedIn()) {
              <a
                routerLink="/catalog"
                routerLinkActive="text-orange-500"
                class="text-sm font-bold transition-colors hover:text-orange-500"
                style="color:#a0a0c0;"
                >Catálogo</a
              >
              <a
                routerLink="/login"
                routerLinkActive="text-orange-500"
                class="text-sm font-bold transition-colors hover:text-orange-500"
                style="color:#a0a0c0;"
                >Iniciar sesión</a
              >
              <a
                routerLink="/register"
                class="px-5 py-2 rounded-xl text-sm font-black text-white"
                style="background:linear-gradient(135deg,#f97316,#ef4444);"
                >Registrarse</a
              >
            } @else if (authService.isAdmin()) {
              <a
                routerLink="/admin/products"
                routerLinkActive="text-orange-500"
                class="text-sm font-bold transition-colors hover:text-orange-500"
                style="color:#a0a0c0;"
                >Productos</a
              >
              <a
                routerLink="/admin/orders"
                routerLinkActive="text-orange-500"
                class="text-sm font-bold transition-colors hover:text-orange-500"
                style="color:#a0a0c0;"
                >Órdenes</a
              >
              <ng-container [ngTemplateOutlet]="userCluster"></ng-container>
            } @else {
              <a
                routerLink="/catalog"
                routerLinkActive="text-orange-500"
                class="text-sm font-bold transition-colors hover:text-orange-500"
                style="color:#a0a0c0;"
                >Catálogo</a
              >
              <a
                routerLink="/my-orders"
                routerLinkActive="text-orange-500"
                class="text-sm font-bold transition-colors hover:text-orange-500"
                style="color:#a0a0c0;"
                >Mis órdenes</a
              >
              <a
                routerLink="/cart"
                class="relative flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all hover:border-orange-500/40 hover:text-orange-500 hover:bg-orange-500/5"
                style="border-color:#ffffff15;color:#e2e2f0;"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path
                    d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
                  />
                </svg>
                <span class="text-sm font-bold">Carrito</span>
                @if (cartService.totalItems() > 0) {
                  <span
                    class="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full text-[10px] font-black text-white"
                    style="background:linear-gradient(135deg,#f97316,#ef4444);box-shadow:0 2px 8px rgba(249,115,22,0.5);"
                  >
                    {{ cartService.totalItems() }}
                  </span>
                }
              </a>
              <ng-container [ngTemplateOutlet]="userCluster"></ng-container>
            }
          </div>

          <!-- Mobile right cluster -->
          <div class="flex items-center gap-3 md:hidden">
            @if (authService.isLoggedIn() && !authService.isAdmin()) {
              <a
                routerLink="/cart"
                class="relative flex items-center justify-center w-10 h-10 rounded-xl border transition-all hover:border-orange-500/40 hover:text-orange-500"
                style="border-color:#ffffff15;color:#e2e2f0;"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path
                    d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
                  />
                </svg>
                @if (cartService.totalItems() > 0) {
                  <span
                    class="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-0.5 flex items-center justify-center rounded-full text-[9px] font-black text-white"
                    style="background:linear-gradient(135deg,#f97316,#ef4444);box-shadow:0 2px 6px rgba(249,115,22,0.5);"
                  >
                    {{ cartService.totalItems() }}
                  </span>
                }
              </a>
            }
            <button
              (click)="toggleMobile()"
              class="flex flex-col justify-center items-center w-10 h-10 rounded-xl border gap-1.5"
              style="border-color:#ffffff15;"
              [attr.aria-expanded]="mobileOpen()"
              aria-label="Menú de navegación"
            >
              <span
                class="block w-[22px] h-[2px] rounded-full bg-gray-200 transition-transform duration-200"
                [style.transform]="
                  mobileOpen() ? 'translateY(4.5px) rotate(45deg)' : 'none'
                "
              ></span>
              <span
                class="block w-[22px] h-[2px] rounded-full bg-gray-200 transition-opacity duration-200"
                [style.opacity]="mobileOpen() ? '0' : '1'"
              ></span>
              <span
                class="block w-[22px] h-[2px] rounded-full bg-gray-200 transition-transform duration-200"
                [style.transform]="
                  mobileOpen() ? 'translateY(-4.5px) rotate(-45deg)' : 'none'
                "
              ></span>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      @if (mobileOpen()) {
        <div
          class="md:hidden border-t px-4 pb-6 pt-4"
          style="background:#11111e;border-color:#ffffff08;"
        >
          @if (!authService.isLoggedIn()) {
            <div class="flex flex-col gap-1">
              <a
                routerLink="/catalog"
                routerLinkActive="text-orange-500"
                (click)="closeMobile()"
                class="px-3 py-3 rounded-xl text-sm font-bold transition-colors hover:bg-white/[0.04] hover:text-orange-500"
                style="color:#a0a0c0;"
                >Catálogo</a
              >
              <a
                routerLink="/login"
                routerLinkActive="text-orange-500"
                (click)="closeMobile()"
                class="px-3 py-3 rounded-xl text-sm font-bold transition-colors hover:bg-white/[0.04] hover:text-orange-500"
                style="color:#a0a0c0;"
                >Iniciar sesión</a
              >
              <a
                routerLink="/register"
                (click)="closeMobile()"
                class="mt-2 w-full flex items-center justify-center py-3 rounded-xl text-sm font-black text-white"
                style="background:linear-gradient(135deg,#f97316,#ef4444);"
                >Registrarse</a
              >
            </div>
          } @else {
            <div
              class="px-3 py-3 rounded-xl mb-3 border"
              style="background:#ffffff05;border-color:#ffffff08;"
            >
              <p class="text-sm font-bold" style="color:#e2e2f0;">
                {{ authService.currentUser()?.fullName }}
              </p>
              <p class="text-xs" style="color:#6060a0;">
                {{ authService.isAdmin() ? 'Administrador' : 'Cliente' }}
              </p>
            </div>

            <div class="flex flex-col gap-1">
              @if (authService.isAdmin()) {
                <a
                  routerLink="/admin/products"
                  routerLinkActive="text-orange-500"
                  (click)="closeMobile()"
                  class="px-3 py-3 rounded-xl text-sm font-bold transition-colors hover:bg-white/[0.04] hover:text-orange-500"
                  style="color:#a0a0c0;"
                  >Productos</a
                >
                <a
                  routerLink="/admin/orders"
                  routerLinkActive="text-orange-500"
                  (click)="closeMobile()"
                  class="px-3 py-3 rounded-xl text-sm font-bold transition-colors hover:bg-white/[0.04] hover:text-orange-500"
                  style="color:#a0a0c0;"
                  >Órdenes</a
                >
              } @else {
                <a
                  routerLink="/catalog"
                  routerLinkActive="text-orange-500"
                  (click)="closeMobile()"
                  class="px-3 py-3 rounded-xl text-sm font-bold transition-colors hover:bg-white/[0.04] hover:text-orange-500"
                  style="color:#a0a0c0;"
                  >Catálogo</a
                >
                <a
                  routerLink="/my-orders"
                  routerLinkActive="text-orange-500"
                  (click)="closeMobile()"
                  class="px-3 py-3 rounded-xl text-sm font-bold transition-colors hover:bg-white/[0.04] hover:text-orange-500"
                  style="color:#a0a0c0;"
                  >Mis órdenes</a
                >
                <a
                  routerLink="/cart"
                  (click)="closeMobile()"
                  class="flex items-center justify-between px-3 py-3 rounded-xl border transition-all hover:border-orange-500/30 hover:bg-orange-500/5"
                  style="border-color:#ffffff10;color:#e2e2f0;"
                >
                  <span class="flex items-center gap-2 text-sm font-bold">
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="9" cy="21" r="1" />
                      <circle cx="20" cy="21" r="1" />
                      <path
                        d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
                      />
                    </svg>
                    Carrito
                  </span>
                  @if (cartService.totalItems() > 0) {
                    <span
                      class="min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full text-xs font-black text-white"
                      style="background:linear-gradient(135deg,#f97316,#ef4444);"
                    >
                      {{ cartService.totalItems() }}
                    </span>
                  }
                </a>
              }

              <div class="mt-2 pt-3 border-t" style="border-color:#ffffff08;">
                <button
                  (click)="logout()"
                  class="w-full flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-bold border transition-all hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30"
                  style="border-color:#ffffff15;color:#a0a0c0;"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Cerrar sesión
                </button>
              </div>
            </div>
          }
        </div>
      }
    </nav>

    <!-- User cluster template -->
    <ng-template #userCluster>
      <div
        class="flex items-center gap-3 pl-3 border-l"
        style="border-color:#ffffff10;"
      >
        <span
          class="text-sm font-semibold max-w-[140px] truncate hidden lg:block"
          style="color:#a0a0c0;"
        >
          {{ authService.currentUser()?.fullName }}
        </span>
        <button
          (click)="logout()"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold border transition-all hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30"
          style="border-color:#ffffff15;color:#a0a0c0;"
        >
          <svg
            class="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Salir
        </button>
      </div>
    </ng-template>
  `,
})
export class NavbarComponent {
  protected readonly authService = inject(AuthService);
  protected readonly cartService = inject(CartService);
  private router = inject(Router);

  mobileOpen = signal(false);
  scrolled = signal(false);

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 10);
  }

  toggleMobile(): void {
    this.mobileOpen.update((v) => !v);
  }
  closeMobile(): void {
    this.mobileOpen.set(false);
  }

  logout(): void {
    this.authService.logout();
    this.closeMobile();
    this.router.navigate(['/login']);
  }
}
