import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Restricts admin routes to users with the admin role.
  if (authService.isAdmin()) {
    return true;
  }

  router.navigate(['/catalog']);
  return false;
};
