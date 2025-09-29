// src/app/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRoles: string[] = route.data?.['roles'] || [];

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  if (expectedRoles.length > 0) {
    const userRoles = authService.getRoles();
    const hasRole = expectedRoles.some(role => userRoles.includes(role));
    if (!hasRole) {
      router.navigate(['/']); // redirect if role not allowed
      return false;
    }
  }

  return true;
};
