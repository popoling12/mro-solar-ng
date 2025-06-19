import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenService } from '../../services/authen.service';

export const authGuard = async () => {
  const router = inject(Router);
  const authService = inject(AuthenService);

  try {
    console.log('🔒 Auth Guard: Starting authentication check');
    
    // รอให้ AuthService initialize เสร็จก่อน
    console.log('⏳ Auth Guard: Waiting for AuthService initialization...');
    await authService.waitForInitialization();
    console.log('✅ Auth Guard: AuthService initialized');
    
    // เช็ค token โดยตรง
    const token = authService.getToken();
    console.log('🔑 Auth Guard: Token exists?', !!token);
    if (!token) {
      console.log('❌ Auth Guard: No token found, redirecting to login');
      router.navigate(['/login']);
      return false;
    }

    // ทดสอบ token กับ server
    console.log('🔄 Auth Guard: Testing token with server...');
    const user = await authService.testToken().toPromise();
    console.log('👤 Auth Guard: User data received?', !!user);
    
    if (!user) {
      console.log('❌ Auth Guard: Invalid token, logging out');
      authService.logout();
      router.navigate(['/login']);
      return false;
    }

    console.log('✅ Auth Guard: Authentication successful');
    return true;
  } catch (error) {
    console.error('❌ Auth Guard Error:', error);
    router.navigate(['/login']);
    return false;
  }
};