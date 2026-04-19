import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer style="background:#0a0a14; border-top:1px solid #ffffff08;">
      <div class="max-w-7xl mx-auto px-4 py-12">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div class="lg:col-span-2">
            <div class="flex items-center gap-3 mb-4">
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
              <div class="flex flex-col leading-none gap-0.5">
                <span class="font-black text-lg tracking-tight text-white">{{
                  brandName
                }}</span>
                <span
                  class="text-[10px] font-semibold tracking-[0.2em] uppercase"
                  style="color:#f97316;"
                  >Tenis Deportivos</span
                >
              </div>
            </div>
            <p class="text-sm leading-relaxed max-w-xs" style="color:#6060a0;">
              Tenis deportivos premium para llevar tu rendimiento al siguiente
              nivel. Calidad, estilo y comodidad en cada paso.
            </p>
            <div class="flex items-center gap-2 mt-5">
              <span
                class="w-1.5 h-1.5 rounded-full animate-pulse inline-block"
                style="background:#f97316;"
              ></span>
              <span
                class="text-xs font-bold tracking-widest uppercase"
                style="color:#f97316;"
              >
                Colección 2026 disponible
              </span>
            </div>
          </div>

          <div>
            <p
              class="text-xs font-black uppercase tracking-widest mb-4"
              style="color:#ffffff40;"
            >
              Tienda
            </p>
            <ul class="flex flex-col gap-2.5" role="list">
              <li>
                <a
                  routerLink="/catalog"
                  class="text-sm font-semibold transition-colors hover:text-orange-500"
                  style="color:#6060a0;"
                  >Catálogo</a
                >
              </li>
              <li>
                <a
                  routerLink="/cart"
                  class="text-sm font-semibold transition-colors hover:text-orange-500"
                  style="color:#6060a0;"
                  >Mi carrito</a
                >
              </li>
              <li>
                <a
                  routerLink="/my-orders"
                  class="text-sm font-semibold transition-colors hover:text-orange-500"
                  style="color:#6060a0;"
                  >Mis órdenes</a
                >
              </li>
            </ul>
          </div>

          <div>
            <p
              class="text-xs font-black uppercase tracking-widest mb-4"
              style="color:#ffffff40;"
            >
              Info
            </p>
            <ul class="flex flex-col gap-2.5" role="list">
              <li>
                <span class="text-sm font-semibold" style="color:#6060a0;"
                  >Pago contra entrega</span
                >
              </li>
              <li>
                <span class="text-sm font-semibold" style="color:#6060a0;"
                  >Envío a todo Colombia</span
                >
              </li>
              <li>
                <span class="text-sm font-semibold" style="color:#6060a0;"
                  >Soporte 24/7</span
                >
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div style="border-top:1px solid #ffffff08;">
        <div
          class="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2"
        >
          <p class="text-xs" style="color:#6060a0;">
            &copy; {{ currentYear }} {{ brandName }}. Todos los derechos
            reservados.
          </p>
          <div class="flex items-center gap-1.5">
            <span class="text-xs" style="color:#ffffff20;">Hecho con</span>
            <span style="color:#ef4444;">♥</span>
            <span class="text-xs" style="color:#ffffff20;">en Colombia</span>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  readonly currentYear = new Date().getFullYear();
  readonly brandName = 'RunZone';
}
