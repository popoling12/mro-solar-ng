import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenService } from '../../services/authen.service';
import { Observable, map, tap, of } from 'rxjs';

export const authGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthenService);

  // ถ้ายังไม่ได้ initialize ให้รอสักครู่
  if (authService.isInitializing()) {
    return new Promise(resolve => {
      const checkInitialized = () => {
        if (!authService.isInitializing()) {
          resolve(authService.isAuthenticated());
        } else {
          setTimeout(checkInitialized, 100);
        }
      };
      checkInitialized();
    });
  }

  // ตรวจสอบการ authenticate
  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};