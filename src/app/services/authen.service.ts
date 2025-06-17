import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of, switchMap, map } from 'rxjs';
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
  private isInitialized = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    if (this.isInitialized) return;
    
    const token = localStorage.getItem('access_token');
    if (token) {
      this.testToken().pipe(
        catchError(() => {
          this.clearAuth();
          return of(null);
        })
      ).subscribe({
        next: (user) => {
          if (user) {
            this.currentUserSubject.next(user);
          }
          this.isInitialized = true;
        },
        error: () => {
          this.clearAuth();
          this.isInitialized = true;
        }
      });
    } else {
      this.isInitialized = true;
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
    return !this.isInitialized;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}