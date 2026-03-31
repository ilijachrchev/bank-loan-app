import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const bankerGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (!authService.isLoggedIn()) return router.createUrlTree(['/login']);
  if (authService.isBanker()) return true;
  return router.createUrlTree(['/customer/dashboard']);
};
