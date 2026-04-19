import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { OrderService } from '../../../core/services/order.service';
import { Order, OrderStatus } from '../../../core/models';
import { CurrencyCopPipe } from '../../../shared/pipes/currency-cop.pipe';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CurrencyCopPipe],
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
      @keyframes shimmer {
        0% {
          background-position: -200% 0;
        }
        100% {
          background-position: 200% 0;
        }
      }
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .order-card {
        animation: fadeInUp 0.35s ease both;
      }
      .order-card:nth-child(2) {
        animation-delay: 0.05s;
      }
      .order-card:nth-child(3) {
        animation-delay: 0.1s;
      }
      .order-card:nth-child(4) {
        animation-delay: 0.15s;
      }
      .order-card:nth-child(5) {
        animation-delay: 0.2s;
      }

      .expanded-panel {
        animation: slideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1) both;
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

      .order-row-btn {
        transition: background 0.18s;
      }
      .order-row-btn:hover {
        background: rgba(249, 115, 22, 0.04);
      }

      .table-row-hover {
        transition: background 0.15s;
      }
      .table-row-hover:hover {
        background: rgba(255, 255, 255, 0.03);
      }

      .chevron {
        transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .chevron-open {
        transform: rotate(180deg);
      }

      .status-select {
        background: #0a0a14;
        border: 1px solid #ffffff15;
        color: #e2e2f0;
        border-radius: 0.75rem;
        padding: 0.7rem 2.5rem 0.7rem 1rem;
        font-size: 0.875rem;
        font-weight: 700;
        outline: none;
        appearance: none;
        -webkit-appearance: none;
        transition:
          border-color 0.18s,
          box-shadow 0.18s;
        cursor: pointer;
      }
      .status-select:focus {
        border-color: #f97316;
        box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.15);
      }
      .status-select option {
        background: #11111e;
        color: #e2e2f0;
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
        class="relative overflow-hidden py-14 px-4"
        style="background:linear-gradient(135deg,#0f0f1e 0%,#1a0a05 60%,#0f0f1e 100%);"
      >
        <div
          class="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20 pointer-events-none"
          style="background:radial-gradient(circle,#f97316,transparent 70%);"
        ></div>
        <div class="relative max-w-7xl mx-auto">
          <div class="flex items-center gap-2 mb-2">
            <span
              class="w-2 h-2 rounded-full bg-orange-500 inline-block"
            ></span>
            <span
              class="text-orange-400 font-bold tracking-[0.2em] text-xs uppercase"
            >
              Mi cuenta
            </span>
          </div>
          <h1
            class="text-4xl sm:text-5xl font-black leading-none tracking-tight"
            style="background:linear-gradient(135deg,#fff 40%,#f97316);
                     -webkit-background-clip:text;-webkit-text-fill-color:transparent;"
          >
            Mis Órdenes
          </h1>
          <p class="mt-2 text-sm" style="color:#a0a0c0;">
            Historial completo de tus compras
          </p>
        </div>
      </header>

      <div class="max-w-7xl mx-auto px-4 py-10">
        <!-- ─── Filter bar ─────────────────────────────────────── -->
        <div class="flex flex-wrap items-center gap-4 mb-8">
          <div class="relative">
            <label class="sr-only">Filtrar por estado</label>
            <select [formControl]="statusFilter" class="status-select">
              <option value="">Todos los estados</option>
              <option value="EnProceso">En Proceso</option>
              <option value="Pagado">Pagado</option>
              <option value="Enviado">Enviado</option>
              <option value="Entregado">Entregado</option>
            </select>
            <!-- custom arrow -->
            <svg
              class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style="color:#6060a0;"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              viewBox="0 0 24 24"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
          <p class="text-sm" style="color:#6060a0;">
            <span class="font-black text-white">{{
              filteredOrders().length
            }}</span>
            &nbsp;orden(es) encontrada(s)
          </p>
        </div>

        <!-- ─── Loading skeletons ────────────────────────────────── -->
        @if (isLoading()) {
          <div class="space-y-4">
            @for (i of [1, 2, 3]; track i) {
              <div
                class="rounded-3xl overflow-hidden border"
                style="background:#11111e;border-color:#ffffff08;"
              >
                <div class="p-6">
                  <div class="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    @for (j of [1, 2, 3, 4, 5]; track j) {
                      <div class="space-y-2">
                        <div class="h-3 skeleton-shimmer rounded-lg w-16"></div>
                        <div class="h-5 skeleton-shimmer rounded-lg w-24"></div>
                      </div>
                    }
                  </div>
                </div>
              </div>
            }
          </div>
        }

        <!-- ─── Empty state ──────────────────────────────────────── -->
        @else if (filteredOrders().length === 0) {
          <div
            class="flex flex-col items-center justify-center py-28 text-center"
          >
            <div
              class="w-24 h-24 rounded-3xl flex items-center justify-center mb-6 text-5xl"
              style="background:linear-gradient(135deg,#f9731615,#ef444415);"
            >
              📦
            </div>
            <h3 class="text-xl font-black text-white mb-2">Sin órdenes</h3>
            <p class="text-sm mb-2" style="color:#6060a0;">
              @if (statusFilter.value) {
                No hay órdenes con el estado seleccionado.
              } @else {
                Aún no has realizado ninguna compra.
              }
            </p>
          </div>
        }

        <!-- ─── Orders list ──────────────────────────────────────── -->
        @else {
          <div class="space-y-4">
            @for (order of filteredOrders(); track order.id) {
              <div
                class="order-card rounded-3xl overflow-hidden border transition-all duration-300"
                style="background:#11111e;border-color:#ffffff08;"
                [style.border-color]="
                  isOrderExpanded(order.id)
                    ? 'rgba(249,115,22,0.3)'
                    : '#ffffff08'
                "
                [style.box-shadow]="
                  isOrderExpanded(order.id)
                    ? '0 8px 32px rgba(249,115,22,0.1)'
                    : 'none'
                "
              >
                <!-- ── Row header ───────────────────────────────── -->
                <button
                  (click)="toggleOrderDetails(order.id)"
                  class="order-row-btn w-full p-5 sm:p-6 flex items-center justify-between gap-4"
                  [attr.aria-expanded]="isOrderExpanded(order.id)"
                >
                  <div class="flex-1 min-w-0">
                    <div
                      class="grid grid-cols-2 sm:grid-cols-5 gap-x-4 gap-y-4 items-center text-left"
                    >
                      <!-- ID -->
                      <div>
                        <p
                          class="text-xs font-bold uppercase tracking-widest mb-1"
                          style="color:#6060a0;"
                        >
                          Orden
                        </p>
                        <p class="text-base font-black" style="color:#f97316;">
                          #{{ order.id }}
                        </p>
                      </div>

                      <!-- Date -->
                      <div>
                        <p
                          class="text-xs font-bold uppercase tracking-widest mb-1"
                          style="color:#6060a0;"
                        >
                          Fecha
                        </p>
                        <p class="text-sm font-bold" style="color:#e2e2f0;">
                          {{ formatDate(order.createdAt) }}
                        </p>
                      </div>

                      <!-- Status -->
                      <div>
                        <p
                          class="text-xs font-bold uppercase tracking-widest mb-1"
                          style="color:#6060a0;"
                        >
                          Estado
                        </p>
                        <span
                          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black"
                          [style]="getStatusStyle(order.status)"
                        >
                          <span
                            class="w-1.5 h-1.5 rounded-full inline-block"
                            [style]="
                              'background:' + getStatusDotColor(order.status)
                            "
                          ></span>
                          {{ getStatusLabel(order.status) }}
                        </span>
                      </div>

                      <!-- Total -->
                      <div>
                        <p
                          class="text-xs font-bold uppercase tracking-widest mb-1"
                          style="color:#6060a0;"
                        >
                          Total
                        </p>
                        <p class="text-base font-black" style="color:#f97316;">
                          {{ order.totalAmount | currencyCop }}
                        </p>
                      </div>

                      <!-- Items -->
                      <div>
                        <p
                          class="text-xs font-bold uppercase tracking-widest mb-1"
                          style="color:#6060a0;"
                        >
                          Artículos
                        </p>
                        <p class="text-sm font-black" style="color:#e2e2f0;">
                          {{ order.items.length }}
                          <span class="font-normal" style="color:#6060a0;">
                            {{ order.items.length === 1 ? 'item' : 'items' }}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Chevron -->
                  <div
                    class="flex-shrink-0 w-8 h-8 rounded-xl border flex items-center justify-center"
                    style="border-color:#ffffff15;"
                  >
                    <svg
                      [class]="
                        'chevron w-4 h-4 ' +
                        (isOrderExpanded(order.id) ? 'chevron-open' : '')
                      "
                      style="color:#a0a0c0;"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      viewBox="0 0 24 24"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </button>

                <!-- ── Expanded detail panel ────────────────────── -->
                @if (isOrderExpanded(order.id)) {
                  <div
                    class="expanded-panel border-t px-5 sm:px-6 pb-6 pt-5"
                    style="border-color:#ffffff08;background:#0a0a14;"
                  >
                    <h3
                      class="text-xs font-bold uppercase tracking-widest mb-4"
                      style="color:#6060a0;"
                    >
                      Artículos del pedido
                    </h3>

                    <!-- Items table -->
                    <div
                      class="overflow-x-auto rounded-2xl border mb-6"
                      style="border-color:#ffffff08;"
                    >
                      <table class="w-full text-sm">
                        <thead>
                          <tr
                            style="background:#ffffff05;border-bottom:1px solid #ffffff08;"
                          >
                            <th
                              class="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest"
                              style="color:#6060a0;"
                            >
                              Producto
                            </th>
                            <th
                              class="text-center px-4 py-3 text-xs font-bold uppercase tracking-widest"
                              style="color:#6060a0;"
                            >
                              Cant.
                            </th>
                            <th
                              class="text-right px-4 py-3 text-xs font-bold uppercase tracking-widest"
                              style="color:#6060a0;"
                            >
                              Precio unit.
                            </th>
                            <th
                              class="text-right px-4 py-3 text-xs font-bold uppercase tracking-widest"
                              style="color:#6060a0;"
                            >
                              Subtotal
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          @for (item of order.items; track item.id) {
                            <tr
                              class="table-row-hover border-b"
                              style="border-color:#ffffff06;"
                            >
                              <td class="px-4 py-3.5">
                                <p
                                  class="font-black text-sm"
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
                              </td>
                              <td class="px-4 py-3.5 text-center">
                                <span
                                  class="inline-flex items-center justify-center w-8 h-8 rounded-xl text-sm font-black"
                                  style="background:#ffffff08;color:#e2e2f0;"
                                >
                                  {{ item.quantity }}
                                </span>
                              </td>
                              <td
                                class="px-4 py-3.5 text-right font-bold"
                                style="color:#a0a0c0;"
                              >
                                {{ item.unitPrice | currencyCop }}
                              </td>
                              <td
                                class="px-4 py-3.5 text-right font-black"
                                style="color:#f97316;"
                              >
                                {{ item.subtotal | currencyCop }}
                              </td>
                            </tr>
                          }
                        </tbody>
                      </table>
                    </div>

                    <!-- Summary + Shipping -->
                    <div
                      class="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-start"
                    >
                      <!-- Shipping address -->
                      <div class="flex items-start gap-3 flex-1">
                        <div
                          class="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                          style="background:rgba(249,115,22,0.1);"
                        >
                          <svg
                            class="w-4 h-4"
                            style="color:#f97316;"
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
                        </div>
                        <div>
                          <p
                            class="text-xs font-bold uppercase tracking-widest mb-1"
                            style="color:#6060a0;"
                          >
                            Dirección de envío
                          </p>
                          <p
                            class="text-sm font-semibold"
                            style="color:#a0a0c0;"
                          >
                            {{ order.shippingAddress }}
                          </p>
                        </div>
                      </div>

                      <!-- Totals -->
                      <div
                        class="rounded-2xl p-4 border min-w-[200px]"
                        style="background:#11111e;border-color:#ffffff08;"
                      >
                        <div class="flex justify-between text-sm mb-2">
                          <span style="color:#6060a0;">Subtotal</span>
                          <span class="font-bold" style="color:#a0a0c0;">
                            {{ calculateSubtotal(order) | currencyCop }}
                          </span>
                        </div>
                        <div
                          class="flex justify-between items-center pt-2 border-t"
                          style="border-color:#ffffff08;"
                        >
                          <span class="font-bold text-sm text-white"
                            >Total</span
                          >
                          <span
                            class="text-lg font-black"
                            style="color:#f97316;"
                          >
                            {{ order.totalAmount | currencyCop }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class MyOrdersComponent {
  private orderService = inject(OrderService);

  orders = signal<Order[]>([]);
  isLoading = signal(false);
  expandedOrderIds = signal<number[]>([]);

  statusFilter = new FormControl<string>('');

  private statusFilterValue = toSignal(this.statusFilter.valueChanges, {
    initialValue: '',
  });

  filteredOrders = computed(() => {
    const filterValue = this.statusFilterValue() as OrderStatus | '';
    if (!filterValue) return this.orders();
    return this.orders().filter((order) => order.status === filterValue);
  });

  constructor() {
    this.loadOrders();
  }

  private loadOrders(): void {
    this.isLoading.set(true);
    this.orderService.getMyOrders().subscribe({
      next: (response) => {
        if (response.data) this.orders.set(response.data.items);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  isOrderExpanded(orderId: number): boolean {
    return this.expandedOrderIds().includes(orderId);
  }

  toggleOrderDetails(orderId: number): void {
    const expanded = this.expandedOrderIds();
    if (expanded.includes(orderId)) {
      this.expandedOrderIds.set(expanded.filter((id) => id !== orderId));
    } else {
      this.expandedOrderIds.set([...expanded, orderId]);
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  getStatusLabel(status: OrderStatus): string {
    const labels: Record<OrderStatus, string> = {
      EnProceso: 'En Proceso',
      Pagado: 'Pagado',
      Enviado: 'Enviado',
      Entregado: 'Entregado',
    };
    return labels[status] ?? status;
  }

  getStatusDotColor(status: OrderStatus): string {
    const colors: Record<OrderStatus, string> = {
      EnProceso: '#fbbf24',
      Pagado: '#60a5fa',
      Enviado: '#a78bfa',
      Entregado: '#4ade80',
    };
    return colors[status] ?? '#a0a0c0';
  }

  getStatusStyle(status: OrderStatus): string {
    const styles: Record<OrderStatus, string> = {
      EnProceso: 'background:rgba(251,191,36,0.1);color:#fbbf24;',
      Pagado: 'background:rgba(96,165,250,0.1);color:#60a5fa;',
      Enviado: 'background:rgba(167,139,250,0.1);color:#a78bfa;',
      Entregado: 'background:rgba(74,222,128,0.1);color:#4ade80;',
    };
    return styles[status] ?? 'background:#ffffff0a;color:#a0a0c0;';
  }

  calculateSubtotal(order: Order): number {
    return order.items.reduce((sum, item) => sum + item.subtotal, 0);
  }
}
