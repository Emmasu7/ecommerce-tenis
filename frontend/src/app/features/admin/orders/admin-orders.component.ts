import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { Order, OrderStatus } from '../../../core/models/order.model';
import { CurrencyCopPipe } from '../../../shared/pipes/currency-cop.pipe';

interface StatusOption {
  value: string;
  label: string;
  color: string;
  bgActive: string;
  textActive: string;
}

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, CurrencyCopPipe],
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
      @keyframes modalIn {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      .page-enter {
        animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
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
      .btn-primary:hover:not(:disabled) {
        filter: brightness(1.1);
        transform: translateY(-1px);
        box-shadow: 0 8px 24px rgba(249, 115, 22, 0.35);
      }
      .btn-primary:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }

      .btn-danger {
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        transition:
          filter 0.2s,
          transform 0.15s,
          box-shadow 0.2s;
      }
      .btn-danger:hover:not(:disabled) {
        filter: brightness(1.1);
        transform: translateY(-1px);
        box-shadow: 0 8px 24px rgba(239, 68, 68, 0.35);
      }
      .btn-danger:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }

      .ghost-btn {
        border: 1px solid #ffffff20;
        color: #a0a0c0;
        background: transparent;
        border-radius: 0.875rem;
        padding: 0.6rem 1.25rem;
        font-weight: 700;
        font-size: 0.8125rem;
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

      .table-row {
        border-bottom: 1px solid #ffffff06;
        transition: background 0.15s;
      }
      .table-row:hover {
        background: rgba(255, 255, 255, 0.025);
      }
      .table-row:last-child {
        border-bottom: none;
      }

      .status-select {
        appearance: none;
        -webkit-appearance: none;
        border: none;
        outline: none;
        cursor: pointer;
        font-size: 0.75rem;
        font-weight: 700;
        border-radius: 99px;
        padding: 0.3rem 0.85rem;
        font-family: inherit;
        transition: filter 0.15s;
      }
      .status-select:hover {
        filter: brightness(1.1);
      }
      .status-select:focus {
        outline: 2px solid rgba(249, 115, 22, 0.4);
        outline-offset: 2px;
      }
      .status-select--yellow {
        background: rgba(234, 179, 8, 0.15);
        color: #facc15;
      }
      .status-select--blue {
        background: rgba(59, 130, 246, 0.15);
        color: #60a5fa;
      }
      .status-select--purple {
        background: rgba(168, 85, 247, 0.15);
        color: #c084fc;
      }
      .status-select--green {
        background: rgba(34, 197, 94, 0.15);
        color: #4ade80;
      }
      .detail-row {
        animation: fadeInUp 0.25s ease both;
      }

      /* Mobile card layout */
      @media (max-width: 767px) {
        .orders-table {
          display: none;
        }
        .orders-cards {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
      }
      @media (min-width: 768px) {
        .orders-table {
          display: table;
        }
        .orders-cards {
          display: none;
        }
      }

      .order-card {
        padding: 1rem 1.25rem;
        border-bottom: 1px solid #ffffff06;
        transition: background 0.15s;
      }
      .order-card:hover {
        background: rgba(255, 255, 255, 0.02);
      }
      .order-card:last-child {
        border-bottom: none;
      }

      ::-webkit-scrollbar {
        height: 4px;
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
              >
                Panel admin
              </span>
            </div>

            <h1
              class="text-3xl sm:text-4xl font-black tracking-tight"
              style="background:linear-gradient(135deg,#fff 40%,#f97316);
                 -webkit-background-clip:text;-webkit-text-fill-color:transparent;"
            >
              Gestión de Órdenes
            </h1>

            <p class="text-sm mt-1" style="color:#a0a0c0;">
              <span class="font-black text-white">{{
                filteredOrders().length
              }}</span>
              órdenes registradas
            </p>
          </div>

          <button
            (click)="loadOrders()"
            class="btn-primary inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-white text-sm"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            Recargar
          </button>
        </div>
      </header>

      <!-- ─── Status filters ─────────────────────────────── -->
      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="flex flex-wrap items-center gap-2 mb-6">
          @for (opt of statusOptions; track opt.value) {
            <button
              (click)="setFilter(opt.value)"
              class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black
                     transition-all duration-200 border"
              [style]="
                selectedStatus() === opt.value
                  ? 'background:' +
                    opt.bgActive +
                    ';color:' +
                    opt.textActive +
                    ';border-color:' +
                    opt.textActive +
                    '33;'
                  : 'background:rgba(255,255,255,0.03);color:#a0a0c0;border-color:#ffffff15;'
              "
            >
              <span
                class="w-1.5 h-1.5 rounded-full flex-shrink-0"
                [style]="'background:' + opt.color"
              ></span>
              {{ opt.label }}
              <span class="tabular-nums font-mono text-xs opacity-70">
                ({{ countByStatus(opt.value) }})
              </span>
            </button>
          }
        </div>

        <!-- ─── Loading skeleton ─────────────────────────────── -->
        @if (loading()) {
          <div
            class="rounded-3xl border overflow-hidden"
            style="background:#11111e;border-color:#ffffff0d;"
          >
            <!-- Header skeleton -->
            <div
              class="flex items-center gap-4 px-5 py-4 border-b"
              style="border-color:#ffffff08;"
            >
              @for (i of [1, 2, 3, 4, 5, 6]; track i) {
                <div class="h-3 skeleton-shimmer rounded flex-1"></div>
              }
            </div>
            <!-- Rows skeleton -->
            @for (r of [1, 2, 3, 4, 5, 6, 7]; track r) {
              <div
                class="flex items-center gap-4 px-5 py-4 border-b"
                style="border-color:#ffffff06;"
              >
                <div class="h-3 skeleton-shimmer rounded w-10"></div>
                <div class="h-3 skeleton-shimmer rounded flex-1"></div>
                <div class="h-3 skeleton-shimmer rounded w-24"></div>
                <div class="h-6 skeleton-shimmer rounded-full w-20"></div>
                <div class="h-3 skeleton-shimmer rounded w-20"></div>
                <div class="h-3 skeleton-shimmer rounded w-16"></div>
              </div>
            }
          </div>
        }

        <!-- ─── Empty state ──────────────────────────────────── -->
        @else if (filteredOrders().length === 0) {
          <div
            class="rounded-3xl border flex flex-col items-center justify-center py-24 px-8 text-center"
            style="background:#11111e;border-color:#ffffff0d;"
          >
            <div
              class="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
              style="background:linear-gradient(135deg,rgba(249,115,22,0.12),rgba(239,68,68,0.12));"
            >
              <svg
                class="w-9 h-9"
                style="color:#f97316;"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M9 17H5a2 2 0 0 0-2 2v1h14v-1a2 2 0 0 0-2-2h-4z" />
                <path
                  d="M12 3C8.13 3 5 6.13 5 10v1l1 6h12l1-6v-1c0-3.87-3.13-7-7-7z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-black mb-2" style="color:#fff;">
              {{
                selectedStatus()
                  ? 'Sin órdenes en este estado'
                  : 'No hay órdenes'
              }}
            </h3>
            <p class="text-sm" style="color:#6060a0;">
              {{
                selectedStatus()
                  ? 'Cambia el filtro para ver otras órdenes'
                  : 'Aún no se han realizado compras en la tienda'
              }}
            </p>
            @if (selectedStatus()) {
              <button (click)="setFilter('')" class="mt-5 ghost-btn">
                Ver todas las órdenes
              </button>
            }
          </div>
        }

        <!-- ─── Table (desktop) + Cards (mobile) ─────────────── -->
        @else {
          <div
            class="rounded-3xl border overflow-hidden"
            style="background:#11111e;border-color:#ffffff0d;
                      box-shadow:0 16px 48px rgba(0,0,0,0.4);"
          >
            <!-- Desktop table -->
            <div class="overflow-x-auto">
              <table class="orders-table w-full" style="min-width:780px;">
                <thead>
                  <tr style="border-bottom:1px solid #ffffff0d;">
                    <th
                      class="px-5 py-3.5 text-left text-xs font-black uppercase tracking-widest"
                      style="color:#6060a0;"
                    >
                      ID
                    </th>
                    <th
                      class="px-5 py-3.5 text-left text-xs font-black uppercase tracking-widest"
                      style="color:#6060a0;"
                    >
                      Cliente
                    </th>
                    <th
                      class="px-5 py-3.5 text-left text-xs font-black uppercase tracking-widest"
                      style="color:#6060a0;"
                    >
                      Fecha
                    </th>
                    <th
                      class="px-5 py-3.5 text-left text-xs font-black uppercase tracking-widest"
                      style="color:#6060a0;"
                    >
                      Estado
                    </th>
                    <th
                      class="px-5 py-3.5 text-right text-xs font-black uppercase tracking-widest"
                      style="color:#6060a0;"
                    >
                      Total
                    </th>
                    <th
                      class="px-5 py-3.5 text-right text-xs font-black uppercase tracking-widest"
                      style="color:#6060a0;"
                    >
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  @for (order of paginatedOrders(); track order.id) {
                    <tr class="table-row">
                      <td class="px-5 py-4">
                        <span
                          class="text-sm font-black tabular-nums"
                          style="color:#f97316;"
                        >
                          #{{ order.id }}
                        </span>
                      </td>
                      <td class="px-5 py-4">
                        <div>
                          <p class="text-sm font-bold" style="color:#e2e2f0;">
                            {{ order.userFullName }}
                          </p>
                        </div>
                      </td>
                      <td class="px-5 py-4">
                        <p class="text-xs tabular-nums" style="color:#a0a0c0;">
                          {{ order.createdAt | date: 'dd/MM/yyyy' }}
                        </p>
                        <p class="text-xs tabular-nums" style="color:#6060a0;">
                          {{ order.createdAt | date: 'HH:mm' }}
                        </p>
                      </td>
                      <td class="px-5 py-4">
                        <div class="relative inline-block">
                          <select
                            [value]="order.status"
                            (change)="
                              changeStatus(order, $any($event.target).value)
                            "
                            [class]="
                              'status-select ' + statusSelectClass(order.status)
                            "
                          >
                            <option value="EnProceso">En Proceso</option>
                            <option value="Pagado">Pagado</option>
                            <option value="Enviado">Enviado</option>
                            <option value="Entregado">Entregado</option>
                          </select>
                        </div>
                      </td>
                      <td class="px-5 py-4 text-right">
                        <span
                          class="text-sm font-black tabular-nums"
                          style="color:#e2e2f0;"
                        >
                          {{ order.totalAmount | currencyCop }}
                        </span>
                      </td>
                      <td class="px-5 py-4">
                        <div class="flex items-center justify-end gap-2">
                          <button
                            (click)="toggleDetail(order.id)"
                            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl
                                         text-xs font-bold border transition-all"
                            [style]="
                              expandedOrderId() === order.id
                                ? 'border-color:rgba(249,115,22,0.4);color:#f97316;background:rgba(249,115,22,0.08);'
                                : 'border-color:#ffffff15;color:#a0a0c0;background:transparent;'
                            "
                          >
                            <svg
                              class="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2.5"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              @if (expandedOrderId() === order.id) {
                                <polyline points="18 15 12 9 6 15" />
                              } @else {
                                <polyline points="6 9 12 15 18 9" />
                              }
                            </svg>
                            {{
                              expandedOrderId() === order.id
                                ? 'Ocultar'
                                : 'Detalle'
                            }}
                          </button>
                          <button
                            (click)="confirmDelete(order)"
                            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl
                                         text-xs font-bold border transition-all"
                            style="border-color:rgba(239,68,68,0.3);color:#f87171;background:rgba(239,68,68,0.05);"
                            onmouseenter="this.style.background='rgba(239,68,68,0.12)';this.style.borderColor='rgba(239,68,68,0.5)';"
                            onmouseleave="this.style.background='rgba(239,68,68,0.05)';this.style.borderColor='rgba(239,68,68,0.3)';"
                          >
                            <svg
                              class="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2.5"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6l-1 14H6L5 6" />
                              <path d="M10 11v6M14 11v6" />
                              <path d="M9 6V4h6v2" />
                            </svg>
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>

                    <!-- Expanded detail row -->
                    @if (expandedOrderId() === order.id) {
                      <tr class="detail-row">
                        <td
                          colspan="6"
                          style="background:#0d0d1a;border-bottom:1px solid #ffffff08;"
                        >
                          <div class="px-5 py-5">
                            <!-- Shipping address -->
                            <div
                              class="flex items-start gap-2.5 mb-4 px-4 py-3 rounded-xl border"
                              style="background:rgba(249,115,22,0.04);border-color:rgba(249,115,22,0.15);"
                            >
                              <svg
                                class="w-4 h-4 mt-0.5 flex-shrink-0"
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
                              <div>
                                <p
                                  class="text-xs font-bold uppercase tracking-widest mb-0.5"
                                  style="color:#6060a0;"
                                >
                                  Dirección de envío
                                </p>
                                <p
                                  class="text-sm font-semibold"
                                  style="color:#e2e2f0;"
                                >
                                  {{ order.shippingAddress }}
                                </p>
                              </div>
                            </div>

                            <!-- Items table -->
                            <p
                              class="text-xs font-black uppercase tracking-widest mb-3"
                              style="color:#6060a0;"
                            >
                              {{ order.items.length }} producto{{
                                order.items.length !== 1 ? 's' : ''
                              }}
                              en esta orden
                            </p>
                            <div
                              class="rounded-2xl overflow-hidden border"
                              style="border-color:#ffffff08;"
                            >
                              <table class="w-full">
                                <thead>
                                  <tr
                                    style="background:rgba(255,255,255,0.02);border-bottom:1px solid #ffffff08;"
                                  >
                                    <th
                                      class="px-4 py-2.5 text-left text-xs font-black uppercase tracking-wider"
                                      style="color:#6060a0;"
                                    >
                                      Producto
                                    </th>
                                    <th
                                      class="px-4 py-2.5 text-left text-xs font-black uppercase tracking-wider hidden sm:table-cell"
                                      style="color:#6060a0;"
                                    >
                                      Código
                                    </th>
                                    <th
                                      class="px-4 py-2.5 text-right text-xs font-black uppercase tracking-wider"
                                      style="color:#6060a0;"
                                    >
                                      P. Unit.
                                    </th>
                                    <th
                                      class="px-4 py-2.5 text-right text-xs font-black uppercase tracking-wider"
                                      style="color:#6060a0;"
                                    >
                                      Cant.
                                    </th>
                                    <th
                                      class="px-4 py-2.5 text-right text-xs font-black uppercase tracking-wider"
                                      style="color:#6060a0;"
                                    >
                                      Subtotal
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  @for (item of order.items; track item.id) {
                                    <tr style="border-top:1px solid #ffffff06;">
                                      <td class="px-4 py-3">
                                        <p
                                          class="text-sm font-bold"
                                          style="color:#e2e2f0;"
                                        >
                                          {{ item.productName }}
                                        </p>
                                      </td>
                                      <td
                                        class="px-4 py-3 hidden sm:table-cell"
                                      >
                                        <span
                                          class="text-xs font-mono px-2 py-0.5 rounded-lg"
                                          style="background:#ffffff08;color:#a0a0c0;"
                                        >
                                          {{ item.productCode }}
                                        </span>
                                      </td>
                                      <td class="px-4 py-3 text-right">
                                        <span
                                          class="text-xs tabular-nums"
                                          style="color:#a0a0c0;"
                                        >
                                          {{ item.unitPrice | currencyCop }}
                                        </span>
                                      </td>
                                      <td class="px-4 py-3 text-right">
                                        <span
                                          class="text-sm font-black tabular-nums"
                                          style="color:#e2e2f0;"
                                        >
                                          {{ item.quantity }}
                                        </span>
                                      </td>
                                      <td class="px-4 py-3 text-right">
                                        <span
                                          class="text-sm font-black tabular-nums"
                                          style="color:#f97316;"
                                        >
                                          {{ item.subtotal | currencyCop }}
                                        </span>
                                      </td>
                                    </tr>
                                  }
                                </tbody>
                                <tfoot>
                                  <tr
                                    style="border-top:1px solid #ffffff0d;background:rgba(249,115,22,0.04);"
                                  >
                                    <td
                                      colspan="3"
                                      class="px-4 py-3 text-xs font-bold uppercase tracking-widest hidden sm:table-cell"
                                      style="color:#6060a0;"
                                    ></td>
                                    <td
                                      class="px-4 py-3 text-right text-xs font-black uppercase tracking-widest"
                                      style="color:#6060a0;"
                                    >
                                      Total
                                    </td>
                                    <td class="px-4 py-3 text-right">
                                      <span
                                        class="text-base font-black tabular-nums"
                                        style="color:#f97316;"
                                      >
                                        {{ order.totalAmount | currencyCop }}
                                      </span>
                                    </td>
                                  </tr>
                                </tfoot>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    }
                  }
                </tbody>
              </table>
            </div>

            <!-- Mobile cards -->
            <div class="orders-cards">
              @for (order of paginatedOrders(); track order.id) {
                <div class="order-card">
                  <div class="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div class="flex items-center gap-2 mb-1">
                        <span
                          class="text-sm font-black tabular-nums"
                          style="color:#f97316;"
                        >
                          #{{ order.id }}
                        </span>
                        <span
                          [class]="
                            'status-select ' + statusSelectClass(order.status)
                          "
                          style="display:inline-block;pointer-events:none;"
                        >
                          {{ statusLabel(order.status) }}
                        </span>
                      </div>
                      <p class="text-sm font-bold" style="color:#e2e2f0;">
                        {{ order.userFullName }}
                      </p>
                      <p
                        class="text-xs tabular-nums mt-0.5"
                        style="color:#6060a0;"
                      >
                        {{ order.createdAt | date: 'dd/MM/yyyy HH:mm' }}
                      </p>
                    </div>
                    <span
                      class="text-base font-black tabular-nums flex-shrink-0"
                      style="color:#f97316;"
                    >
                      {{ order.totalAmount | currencyCop }}
                    </span>
                  </div>

                  <div class="flex items-center gap-2">
                    <select
                      [value]="order.status"
                      (change)="changeStatus(order, $any($event.target).value)"
                      [class]="
                        'status-select flex-1 ' +
                        statusSelectClass(order.status)
                      "
                      style="text-align:center;"
                    >
                      <option value="EnProceso">En Proceso</option>
                      <option value="Pagado">Pagado</option>
                      <option value="Enviado">Enviado</option>
                      <option value="Entregado">Entregado</option>
                    </select>
                    <button
                      (click)="toggleDetail(order.id)"
                      class="flex-1 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all"
                      [style]="
                        expandedOrderId() === order.id
                          ? 'border-color:rgba(249,115,22,0.4);color:#f97316;background:rgba(249,115,22,0.08);'
                          : 'border-color:#ffffff15;color:#a0a0c0;background:transparent;'
                      "
                    >
                      {{
                        expandedOrderId() === order.id
                          ? 'Ocultar'
                          : 'Ver detalle'
                      }}
                    </button>
                    <button
                      (click)="confirmDelete(order)"
                      class="px-3 py-1.5 rounded-xl text-xs font-bold border transition-all"
                      style="border-color:rgba(239,68,68,0.3);color:#f87171;background:rgba(239,68,68,0.05);"
                    >
                      <svg
                        class="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14H6L5 6" />
                        <path d="M9 6V4h6v2" />
                      </svg>
                    </button>
                  </div>

                  @if (expandedOrderId() === order.id) {
                    <div
                      class="mt-3 pt-3 border-t detail-row"
                      style="border-color:#ffffff08;"
                    >
                      <p
                        class="text-xs font-bold uppercase tracking-widest mb-2"
                        style="color:#6060a0;"
                      >
                        Envío
                      </p>
                      <p class="text-xs mb-3" style="color:#a0a0c0;">
                        {{ order.shippingAddress }}
                      </p>
                      <p
                        class="text-xs font-bold uppercase tracking-widest mb-2"
                        style="color:#6060a0;"
                      >
                        Productos
                      </p>
                      @for (item of order.items; track item.id) {
                        <div
                          class="flex items-center justify-between py-2 border-t"
                          style="border-color:#ffffff06;"
                        >
                          <div>
                            <p class="text-xs font-bold" style="color:#e2e2f0;">
                              {{ item.productName }}
                            </p>
                            <p class="text-xs font-mono" style="color:#6060a0;">
                              {{ item.productCode }}
                            </p>
                          </div>
                          <div class="text-right">
                            <p
                              class="text-xs font-black tabular-nums"
                              style="color:#f97316;"
                            >
                              {{ item.subtotal | currencyCop }}
                            </p>
                            <p
                              class="text-xs tabular-nums"
                              style="color:#6060a0;"
                            >
                              × {{ item.quantity }}
                            </p>
                          </div>
                        </div>
                      }
                    </div>
                  }
                </div>
              }
            </div>

            <!-- ── Pagination ──────────────────────────────────── -->
            @if (totalPages() > 1) {
              <div
                class="flex items-center justify-between px-5 py-4 border-t"
                style="border-color:#ffffff0d;"
              >
                <p class="text-xs tabular-nums" style="color:#6060a0;">
                  Página
                  <span class="font-black" style="color:#e2e2f0;">{{
                    currentPage()
                  }}</span>
                  de
                  <span class="font-black" style="color:#e2e2f0;">{{
                    totalPages()
                  }}</span>
                  &nbsp;·&nbsp;
                  <span class="font-bold" style="color:#a0a0c0;">
                    {{ filteredOrders().length }} total
                  </span>
                </p>
                <div class="flex items-center gap-2">
                  <button
                    (click)="prevPage()"
                    [disabled]="currentPage() === 1"
                    class="px-4 py-1.5 text-xs font-bold rounded-xl border transition-all"
                    style="border-color:#ffffff15;color:#a0a0c0;"
                    [style.opacity]="currentPage() === 1 ? '0.35' : '1'"
                    [style.cursor]="
                      currentPage() === 1 ? 'not-allowed' : 'pointer'
                    "
                    onmouseenter="if(!this.disabled){this.style.borderColor='#f97316';this.style.color='#f97316';}"
                    onmouseleave="this.style.borderColor='#ffffff15';this.style.color='#a0a0c0';"
                  >
                    ← Anterior
                  </button>
                  <button
                    (click)="nextPage()"
                    [disabled]="currentPage() === totalPages()"
                    class="px-4 py-1.5 text-xs font-bold rounded-xl border transition-all"
                    style="border-color:#ffffff15;color:#a0a0c0;"
                    [style.opacity]="
                      currentPage() === totalPages() ? '0.35' : '1'
                    "
                    [style.cursor]="
                      currentPage() === totalPages() ? 'not-allowed' : 'pointer'
                    "
                    onmouseenter="if(!this.disabled){this.style.borderColor='#f97316';this.style.color='#f97316';}"
                    onmouseleave="this.style.borderColor='#ffffff15';this.style.color='#a0a0c0';"
                  >
                    Siguiente →
                  </button>
                </div>
              </div>
            }
          </div>
        }

        <!-- ─── Modal confirmation delete ──────────────────── -->
        @if (orderToDelete()) {
          <div
            class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            style="background:rgba(0,0,0,0.75);backdrop-filter:blur(8px);"
            (click)="orderToDelete.set(null)"
          >
            <div
              class="modal-enter w-full max-w-sm rounded-3xl border p-6"
              style="background:#11111e;border-color:rgba(249,115,22,0.2);
                        box-shadow:0 32px 80px rgba(0,0,0,0.6),0 0 0 1px rgba(249,115,22,0.08);"
              (click)="$event.stopPropagation()"
            >
              <!-- Icon -->
              <div
                class="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                style="background:rgba(239,68,68,0.12);"
              >
                <svg
                  class="w-6 h-6"
                  style="color:#f87171;"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14H6L5 6" />
                  <path d="M10 11v6M14 11v6" />
                  <path d="M9 6V4h6v2" />
                </svg>
              </div>

              <h3 class="text-xl font-black mb-2" style="color:#fff;">
                Eliminar orden
              </h3>
              <p class="text-sm leading-relaxed mb-6" style="color:#a0a0c0;">
                ¿Estás seguro de que deseas eliminar la orden
                <span class="font-black tabular-nums" style="color:#f97316;">
                  #{{ orderToDelete()?.id }}
                </span>
                de
                <span class="font-bold" style="color:#e2e2f0;">
                  {{ orderToDelete()?.userFullName }} </span
                >? Esta acción no se puede deshacer.
              </p>

              <div class="flex gap-3">
                <button
                  (click)="orderToDelete.set(null)"
                  class="ghost-btn flex-1"
                >
                  Cancelar
                </button>
                <button
                  (click)="deleteOrder()"
                  [disabled]="deleting()"
                  class="btn-danger flex-1 flex items-center justify-center gap-2
                               py-3 rounded-2xl font-black text-white text-sm"
                >
                  @if (deleting()) {
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
                    Eliminando...
                  } @else {
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14H6L5 6" />
                      <path d="M9 6V4h6v2" />
                    </svg>
                    Eliminar orden
                  }
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class AdminOrdersComponent {
  private orderService = inject(OrderService);

  orders = signal<Order[]>([]);
  loading = signal(true);
  deleting = signal(false);
  orderToDelete = signal<Order | null>(null);
  expandedOrderId = signal<number | null>(null);
  selectedStatus = signal('');
  currentPage = signal(1);
  readonly pageSize = 10;

  readonly statusOptions: StatusOption[] = [
    {
      value: '',
      label: 'Todas',
      color: '#a0a0c0',
      bgActive: 'rgba(160,160,192,0.12)',
      textActive: '#e2e2f0',
    },
    {
      value: 'EnProceso',
      label: 'En Proceso',
      color: '#fbbf24',
      bgActive: 'rgba(251,191,36,0.12)',
      textActive: '#fbbf24',
    },
    {
      value: 'Pagado',
      label: 'Pagado',
      color: '#60a5fa',
      bgActive: 'rgba(96,165,250,0.12)',
      textActive: '#60a5fa',
    },
    {
      value: 'Enviado',
      label: 'Enviado',
      color: '#a78bfa',
      bgActive: 'rgba(167,139,250,0.12)',
      textActive: '#a78bfa',
    },
    {
      value: 'Entregado',
      label: 'Entregado',
      color: '#4ade80',
      bgActive: 'rgba(74,222,128,0.12)',
      textActive: '#4ade80',
    },
  ];

  filteredOrders = computed(() =>
    this.selectedStatus()
      ? this.orders().filter((o) => o.status === this.selectedStatus())
      : this.orders(),
  );

  totalPages = computed(() =>
    Math.ceil(this.filteredOrders().length / this.pageSize),
  );

  paginatedOrders = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredOrders().slice(start, start + this.pageSize);
  });

  constructor() {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading.set(true);
    this.orderService.getAll(1, 200).subscribe({
      next: (res) => {
        if (res.data) this.orders.set(res.data.items);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  setFilter(status: string): void {
    this.selectedStatus.set(status);
    this.currentPage.set(1);
    this.expandedOrderId.set(null);
  }

  toggleDetail(id: number): void {
    this.expandedOrderId.set(this.expandedOrderId() === id ? null : id);
  }

  changeStatus(order: Order, status: OrderStatus): void {
    this.orderService.updateStatus(order.id, status).subscribe({
      next: () => this.loadOrders(),
      error: () => this.loadOrders(),
    });
  }

  confirmDelete(order: Order): void {
    this.orderToDelete.set(order);
  }

  deleteOrder(): void {
    const order = this.orderToDelete();
    if (!order) return;
    this.deleting.set(true);
    this.orderService.delete(order.id).subscribe({
      next: () => {
        this.orderToDelete.set(null);
        this.deleting.set(false);
        this.loadOrders();
      },
      error: () => this.deleting.set(false),
    });
  }

  countByStatus(status: string): number {
    return status
      ? this.orders().filter((o) => o.status === status).length
      : this.orders().length;
  }

  statusLabel(status: string): string {
    const opt = this.statusOptions.find((o) => o.value === status);
    return opt?.label ?? status;
  }

  statusSelectClass(status: OrderStatus): string {
    const map: Record<OrderStatus, string> = {
      EnProceso: 'status-select--yellow',
      Pagado: 'status-select--blue',
      Enviado: 'status-select--purple',
      Entregado: 'status-select--green',
    };
    return map[status] ?? '';
  }

  prevPage(): void {
    if (this.currentPage() > 1) this.currentPage.update((p) => p - 1);
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages())
      this.currentPage.update((p) => p + 1);
  }
}
