import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenService } from '../../services/authen.service';

export const authGuard = async () => {
  const router = inject(Router);
  const authService = inject(AuthenService);

  try {
    // รอให้ AuthService initialize เสร็จก่อน
    const isAuthenticated = await authService.waitForInitialization();
    
    if (!isAuthenticated) {
      router.navigate(['/login']);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Auth guard error:', error);
    router.navigate(['/login']);
    return false;
  }
};