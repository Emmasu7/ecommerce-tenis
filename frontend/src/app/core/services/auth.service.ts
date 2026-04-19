import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, ApiResponse, LoginRequest, RegisterRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  currentUser = signal<AuthResponse | null>(null);
  isLoggedIn = computed(() => !!this.currentUser());
  isAdmin = computed(() => this.currentUser()?.role === 'Admin');

  constructor() {
    this.loadUserFromToken();
  }

  login(dto: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/auth/login`, dto).pipe(
      tap(response => {
        if (response.data) {
          localStorage.setItem('token', response.data.token);
          this.currentUser.set(response.data);
        }
      })
    );
  }

  register(dto: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/auth/register`, dto);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUser.set(null);
  }

  private loadUserFromToken(): void {
    const token = localStorage.getItem('token');
    if (token) {
      // Try to decode and set user from token
      // In a real app, you might validate the token or call an endpoint
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // Basic user info from token - in production, you'd fetch from /me endpoint
        this.currentUser.set({
          token,
          email: payload.email || '',
          fullName: payload.fullName || '',
          role: payload.role || 'Client'
        });
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
  }
}
