import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Interfaces
export interface User {
  id: number;
  email: string;
  is_active: boolean;
  role: UserRole;
  status: UserStatus;
  department?: string;
  created_at: string;
  updated_at: string;
}

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended'
}

export interface UserCreate {
  email: string;
  password: string;
  role: UserRole;
  department?: string;
}

export interface UserUpdate {
  email?: string;
  department?: string;
}

export interface UserRoleUpdate {
  role: UserRole;
  status?: UserStatus;
}

export interface UserPasswordChange {
  current_password: string;
  new_password: string;
}

export interface UserResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface UserListResponse {
  success: boolean;
  message: string;
  data: User[];
  total: number;
  page: number;
  per_page: number;
}

export interface UserStats {
  total_users: number;
  active_users: number;
  inactive_users: number;
  role_distribution: { role: string; count: number }[];
  status_distribution: { status: string; count: number }[];
  department_distribution: { department: string; count: number }[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = `${environment.apiUrl}/api/v1/users`;

  constructor(private http: HttpClient) {}

  // Create new user (Admin only)
  createUser(userData: UserCreate): Observable<UserResponse> {
    return this.http.post<UserResponse>(this.API_URL, userData);
  }

  // Get users list with filtering and pagination
  getUsers(params: {
    skip?: number;
    limit?: number;
    role?: UserRole;
    status?: UserStatus;
    search?: string;
    department?: string;
  }): Observable<UserListResponse> {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        httpParams = httpParams.set(key, value.toString());
      }
    });
    return this.http.get<UserListResponse>(this.API_URL, { params: httpParams });
  }

  // Get current user profile
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/me`);
  }

  // Update current user profile
  updateCurrentUser(userData: UserUpdate): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.API_URL}/me`, userData);
  }

  // Change current user password
  changePassword(passwordData: UserPasswordChange): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.API_URL}/me/change-password`, passwordData);
  }

  // Get user by ID
  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/${userId}`);
  }

  // Update user by ID
  updateUser(userId: number, userData: UserUpdate): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.API_URL}/${userId}`, userData);
  }

  // Update user role
  updateUserRole(userId: number, roleData: UserRoleUpdate): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.API_URL}/${userId}/role`, roleData);
  }

  // Reset user password
  resetUserPassword(userId: number): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.API_URL}/${userId}/reset-password`, {});
  }

  // Delete user (soft delete)
  deleteUser(userId: number): Observable<UserResponse> {
    return this.http.delete<UserResponse>(`${this.API_URL}/${userId}`);
  }

  // Restore deleted user
  restoreUser(userId: number): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.API_URL}/${userId}/restore`, {});
  }

  // Get available roles
  getAvailableRoles(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/roles/available`);
  }

  // Check user permissions
  checkUserPermissions(): Observable<any> {
    return this.http.get(`${this.API_URL}/permissions/check`);
  }

  // Get user statistics
  getUserStats(): Observable<UserStats> {
    return this.http.get<UserStats>(`${this.API_URL}/stats/summary`);
  }
}
