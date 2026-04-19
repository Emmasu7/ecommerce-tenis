import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ProductListComponent } from './features/catalog/product-list/product-list.component';
import { ProductDetailComponent } from './features/catalog/product-detail/product-detail.component';
import { CartComponent } from './features/cart/cart/cart.component';
import { MyOrdersComponent } from './features/orders/my-orders/my-orders.component';
import { AdminProductsComponent } from './features/admin/products/admin-products.component';
import { AdminProductFormComponent } from './features/admin/products/admin-product-form.component';
import { AdminOrdersComponent } from './features/admin/orders/admin-orders.component';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

// Public routes for authentication and catalog browsing.
export const routes: Routes = [
  { path: '', redirectTo: '/catalog', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'catalog', component: ProductListComponent },
  { path: 'catalog/:id', component: ProductDetailComponent },
  { path: 'cart', component: CartComponent, canActivate: [authGuard] },
  { path: 'my-orders', component: MyOrdersComponent, canActivate: [authGuard] },
  { path: 'admin', redirectTo: '/admin/products', pathMatch: 'full' },

  // Admin routes require both authentication and admin role validation.
  {
    path: 'admin/products',
    component: AdminProductsComponent,
    canActivate: [authGuard, adminGuard],
  },
  // 'new' must come before ':id' to prevent "new" from being treated as a product ID
  {
    path: 'admin/products/new',
    component: AdminProductFormComponent,
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'admin/products/:id',
    component: AdminProductFormComponent,
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'admin/orders',
    component: AdminOrdersComponent,
    canActivate: [authGuard, adminGuard],
  },
  { path: '**', redirectTo: '/catalog' },
];
