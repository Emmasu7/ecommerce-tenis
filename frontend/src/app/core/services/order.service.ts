import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Order, CreateOrderRequest, OrderStatus, ApiResponse, PaginatedResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  create(dto: CreateOrderRequest): Observable<ApiResponse<Order>> {
    return this.http.post<ApiResponse<Order>>(`${this.apiUrl}/orders`, dto);
  }

  getAll(page?: number, pageSize?: number): Observable<ApiResponse<PaginatedResponse<Order>>> {
    let params = new HttpParams();
    if (page !== undefined) params = params.set('page', page.toString());
    if (pageSize !== undefined) params = params.set('pageSize', pageSize.toString());

    return this.http.get<ApiResponse<PaginatedResponse<Order>>>(`${this.apiUrl}/orders`, { params });
  }

  getMyOrders(page?: number, pageSize?: number): Observable<ApiResponse<PaginatedResponse<Order>>> {
    let params = new HttpParams();
    if (page !== undefined) params = params.set('page', page.toString());
    if (pageSize !== undefined) params = params.set('pageSize', pageSize.toString());

    return this.http.get<ApiResponse<PaginatedResponse<Order>>>(`${this.apiUrl}/orders/my-orders`, { params });
  }

  getById(id: number): Observable<ApiResponse<Order>> {
    return this.http.get<ApiResponse<Order>>(`${this.apiUrl}/orders/${id}`);
  }

  updateStatus(id: number, status: OrderStatus): Observable<ApiResponse<Order>> {
    return this.http.patch<ApiResponse<Order>>(`${this.apiUrl}/orders/${id}/status`, { status });
  }

  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/orders/${id}`);
  }
}
