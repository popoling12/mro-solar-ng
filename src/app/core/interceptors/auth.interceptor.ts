import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  // ดึง token ตรงจาก localStorage เพื่อหลีกเลี่ยง circular dependency
  const token = localStorage.getItem('access_token');
  const router = inject(Router);

  if (token) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // ไม่ควร logout ที่นี่โดยตรง เพราะจะเกิดปัญหา DI ซ้ำซ้อน
        // สามารถ redirect ไป login หรือแสดงข้อความได้
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
}; 