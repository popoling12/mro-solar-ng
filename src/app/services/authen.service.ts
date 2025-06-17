import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of, switchMap, firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: number;
  email: string;
  is_active: boolean;
  // Add other user properties as needed
}

@Injectable({
  providedIn: 'root'
})
export class AuthenService {
  private readonly API_URL = `${environment.apiUrl}/api/v1/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isInitialized = new BehaviorSubject<boolean>(false);
  public isInitialized$ = this.isInitialized.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.initializeAuth();
  }

  private async initializeAuth(): Promise<void> {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        const user = await firstValueFrom(
          this.testToken().pipe(
            catchError(() => {
              this.clearAuth();
              return of(null);
            })
          )
        );
        
        if (user) {
          this.currentUserSubject.next(user);
        }
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      this.clearAuth();
    } finally {
      this.isInitialized.next(true);
    }
  }

  login(email: string, password: string): Observable<User> {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    return this.http.post<TokenResponse>(`${this.API_URL}/login/access-token`, formData).pipe(
      switchMap(response => {
        localStorage.setItem('access_token', response.access_token);
        return this.testToken();
      }),
      tap(user => {
        this.currentUserSubject.next(user);
      })
    );
  }

  testToken(): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/login/test-token`, {});
  }

  logout(): void {
    this.clearAuth();
    this.router.navigate(['/login']);
  }

  private clearAuth(): void {
    localStorage.removeItem('access_token');
    this.currentUserSubject.next(null);
  }

  recoverPassword(email: string): Observable<any> {
    return this.http.post(`${this.API_URL}/password-recovery/${email}`, {});
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.API_URL}/reset-password/`, {
      token,
      new_password: newPassword
    });
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.currentUserSubject.value;
  }

  isInitializing(): boolean {
    return !this.isInitialized.value;
  }

  // เพิ่มฟังก์ชันรอให้ initialization เสร็จ
  async waitForInitialization(): Promise<boolean> {
    if (this.isInitialized.value) {
      return this.isAuthenticated();
    }
    
    return new Promise((resolve) => {
      const subscription = this.isInitialized$.subscribe(initialized => {
        if (initialized) {
          subscription.unsubscribe();
          resolve(this.isAuthenticated());
        }
      });
    });
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}