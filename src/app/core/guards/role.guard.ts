import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenService } from '../../services/authen.service';
import { UserService } from '../../services/user.service';

export const roleGuard = (requiredRole: string) => {
  return async () => {
    const router = inject(Router);
    const authService = inject(AuthenService);
    const userService = inject(UserService);

    try {
      // รอให้ AuthService initialize เสร็จก่อน
      const isAuthenticated = await authService.waitForInitialization();
      
      if (!isAuthenticated) {
        router.navigate(['/login']);
        return false;
      }

      // เช็ค permission
      const permissions = await userService.checkUserPermissions().toPromise();
      if (!permissions?.can_manage_users) {
        router.navigate(['/no-permission']);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Role guard error:', error);
      router.navigate(['/login']);
      return false;
    }
  };
}; 