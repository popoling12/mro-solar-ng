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