import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Product,
  ProductFilter,
  CreateProductRequest,
  UpdateProductRequest,
  ApiResponse,
  PaginatedResponse,
  PRODUCT_SIZE_MAP,
  PRODUCT_COLOR_MAP,
} from '../models';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAll(
    filter?: ProductFilter,
  ): Observable<ApiResponse<PaginatedResponse<Product>>> {
    let params = new HttpParams();

    if (filter) {
      if (filter.search) params = params.set('search', filter.search);
      if (filter.size)
        params = params.set('size', PRODUCT_SIZE_MAP[filter.size].toString());
      if (filter.color)
        params = params.set(
          'color',
          PRODUCT_COLOR_MAP[filter.color].toString(),
        );
      if (filter.minPrice !== undefined)
        params = params.set('minPrice', filter.minPrice.toString());
      if (filter.maxPrice !== undefined)
        params = params.set('maxPrice', filter.maxPrice.toString());
      if (filter.page !== undefined)
        params = params.set('page', filter.page.toString());
      if (filter.pageSize !== undefined)
        params = params.set('pageSize', filter.pageSize.toString());
    }

    return this.http.get<ApiResponse<PaginatedResponse<Product>>>(
      `${this.apiUrl}/products`,
      { params },
    );
  }

  getById(id: number): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(`${this.apiUrl}/products/${id}`);
  }

  create(dto: CreateProductRequest): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(`${this.apiUrl}/products`, dto);
  }

  update(
    id: number,
    dto: UpdateProductRequest,
  ): Observable<ApiResponse<Product>> {
    return this.http.put<ApiResponse<Product>>(
      `${this.apiUrl}/products/${id}`,
      dto,
    );
  }

  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/products/${id}`);
  }

  uploadImage(
    id: number,
    file: File,
  ): Observable<ApiResponse<{ imageUrl: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse<{ imageUrl: string }>>(
      `${this.apiUrl}/products/${id}/image`,
      formData,
    );
  }
}
