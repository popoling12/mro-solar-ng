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
  private readonly TOKEN_KEY = 'access_token';
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
      console.log('🔄 Auth Service: Initializing...');
      const token = this.getToken();
      console.log('🔑 Auth Service: Token exists?', !!token);
      
      if (token) {
        console.log('🔄 Auth Service: Testing token...');
        const user = await firstValueFrom(
          this.testToken().pipe(
            catchError((error) => {
              console.error('❌ Auth Service: Token test failed', error);
              this.clearAuth();
              return of(null);
            })
          )
        );
        
        if (user) {
          console.log('✅ Auth Service: Token valid, user authenticated');
          this.currentUserSubject.next(user);
        } else {
          console.log('❌ Auth Service: Invalid token, clearing auth');
          this.clearAuth();
        }
      } else {
        console.log('ℹ️ Auth Service: No token found');
      }
    } catch (error) {
      console.error('❌ Auth Service: Initialization failed:', error);
      this.clearAuth();
    } finally {
      console.log('✅ Auth Service: Initialization complete');
      this.isInitialized.next(true);
    }
  }

  login(email: string, password: string): Observable<User> {
    console.log('🔑 Auth Service: Attempting login...');
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    return this.http.post<TokenResponse>(`${this.API_URL}/login/access-token`, formData).pipe(
      tap(response => {
        console.log('✅ Auth Service: Login successful, setting token');
        this.setToken(response.access_token);
      }),
      switchMap(() => {
        console.log('🔄 Auth Service: Testing new token...');
        return this.testToken();
      }),
      tap(user => {
        console.log('✅ Auth Service: Token valid, setting user data');
        this.currentUserSubject.next(user);
      }),
      catchError(error => {
        console.error('❌ Auth Service: Login failed:', error);
        throw error;
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
    console.log('🧹 Auth Service: Clearing authentication data');
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUserSubject.next(null);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    console.log('🔑 Auth Service: Getting token', !!token);
    return token;
  }

  isAuthenticated(): boolean {
    const hasToken = !!this.getToken();
    const hasUser = !!this.currentUserSubject.value;
    console.log('🔒 Auth Service: Checking authentication', { hasToken, hasUser });
    return hasToken && hasUser;
  }

  isInitializing(): boolean {
    return !this.isInitialized.value;
  }

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

  recoverPassword(email: string): Observable<any> {
    return this.http.post(`${this.API_URL}/password-recovery/${email}`, {});
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.API_URL}/reset-password/`, {
      token,
      new_password: newPassword
    });
  }
}