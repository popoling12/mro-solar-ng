import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService, User, UserRole, UserStatus, UserCreate, UserUpdate, UserRoleUpdate, UserStats } from '../../../services/user.service';
import { AuthenService } from '../../../services/authen.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  stats: UserStats | null = null;
  permissions: any = null;
  availableRoles: string[] = [];
  
  // Pagination
  page = 1;
  pageSize = 10;
  totalItems = 0;
  
  // Filters
  filters = {
    role: '' as UserRole | '',
    status: '' as UserStatus | '',
    search: '',
    department: ''
  };
  
  // New user form
  newUser: UserCreate = {
    email: '',
    password: '',
    role: UserRole.USER,
    department: ''
  };
  
  // Selected user for editing
  selectedUser: User | null = null;
  editUser: UserUpdate = {};
  roleUpdate: UserRoleUpdate = {
    role: UserRole.USER
  };
  
  // Loading states
  isLoading = false;
  isCreating = false;
  isUpdating = false;
  
  // Error messages
  errorMessage = '';
  
  // Active modal reference
  activeModal: any = null;
  
  constructor(
    private userService: UserService,
    private authService: AuthenService,
    private modalService: NgbModal
  ) {}
  
  ngOnInit() {
    this.loadPermissions();
    this.loadUsers();
    this.loadStats();
  }
  
  loadPermissions() {
    this.userService.checkUserPermissions().subscribe({
      next: (permissions) => {
        this.permissions = permissions;
        if (permissions.can_manage_users) {
          this.loadAvailableRoles();
        }
      },
      error: (error) => {
        console.error('Failed to load permissions:', error);
        this.errorMessage = 'ไม่สามารถโหลดข้อมูลสิทธิ์ได้';
      }
    });
  }
  
  loadAvailableRoles() {
    this.userService.getAvailableRoles().subscribe({
      next: (roles) => {
        this.availableRoles = roles;
      },
      error: (error) => {
        console.error('Failed to load roles:', error);
      }
    });
  }
  
  loadUsers() {
    this.isLoading = true;
    const params: any = {
      skip: (this.page - 1) * this.pageSize,
      limit: this.pageSize
    };

    // Only add non-empty filters
    if (this.filters.role) params.role = this.filters.role;
    if (this.filters.status) params.status = this.filters.status;
    if (this.filters.search) params.search = this.filters.search;
    if (this.filters.department) params.department = this.filters.department;
    
    this.userService.getUsers(params).subscribe({
      next: (response) => {
        this.users = response.data;
        this.totalItems = response.total;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load users:', error);
        this.errorMessage = 'ไม่สามารถโหลดข้อมูลผู้ใช้ได้';
        this.isLoading = false;
      }
    });
  }
  
  loadStats() {
    this.userService.getUserStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (error) => {
        console.error('Failed to load stats:', error);
      }
    });
  }
  
  createUser() {
    this.isCreating = true;
    this.userService.createUser(this.newUser).subscribe({
      next: (response) => {
        this.loadUsers();
        this.loadStats();
        this.isCreating = false;
        this.newUser = {
          email: '',
          password: '',
          role: UserRole.USER,
          department: ''
        };
        this.activeModal?.close();
      },
      error: (error) => {
        console.error('Failed to create user:', error);
        this.errorMessage = 'ไม่สามารถสร้างผู้ใช้ได้';
        this.isCreating = false;
      }
    });
  }
  
  updateUser(userId: number) {
    if (!userId) return;
    
    this.isUpdating = true;
    this.userService.updateUser(userId, this.editUser).subscribe({
      next: (response) => {
        this.loadUsers();
        this.isUpdating = false;
        this.selectedUser = null;
        this.activeModal?.close();
      },
      error: (error) => {
        console.error('Failed to update user:', error);
        this.errorMessage = 'ไม่สามารถอัปเดตผู้ใช้ได้';
        this.isUpdating = false;
      }
    });
  }
  
  updateUserRole(userId: number) {
    if (!userId) return;
    
    this.isUpdating = true;
    this.userService.updateUserRole(userId, this.roleUpdate).subscribe({
      next: (response) => {
        this.loadUsers();
        this.isUpdating = false;
        this.selectedUser = null;
        this.activeModal?.close();
      },
      error: (error) => {
        console.error('Failed to update user role:', error);
        this.errorMessage = 'ไม่สามารถอัปเดตบทบาทผู้ใช้ได้';
        this.isUpdating = false;
      }
    });
  }
  
  deleteUser(userId: number) {
    if (!userId) return;
    
    if (confirm('คุณต้องการลบผู้ใช้นี้ใช่หรือไม่?')) {
      this.userService.deleteUser(userId).subscribe({
        next: (response) => {
          this.loadUsers();
          this.loadStats();
        },
        error: (error) => {
          console.error('Failed to delete user:', error);
          this.errorMessage = 'ไม่สามารถลบผู้ใช้ได้';
        }
      });
    }
  }
  
  restoreUser(userId: number) {
    if (!userId) return;
    
    this.userService.restoreUser(userId).subscribe({
      next: (response) => {
        this.loadUsers();
        this.loadStats();
      },
      error: (error) => {
        console.error('Failed to restore user:', error);
        this.errorMessage = 'ไม่สามารถกู้คืนผู้ใช้ได้';
      }
    });
  }
  
  resetUserPassword(userId: number) {
    if (!userId) return;
    
    if (confirm('คุณต้องการรีเซ็ตรหัสผ่านของผู้ใช้นี้ใช่หรือไม่?')) {
      this.userService.resetUserPassword(userId).subscribe({
        next: (response) => {
          alert(`รหัสผ่านชั่วคราว: ${response.message}`);
        },
        error: (error) => {
          console.error('Failed to reset password:', error);
          this.errorMessage = 'ไม่สามารถรีเซ็ตรหัสผ่านได้';
        }
      });
    }
  }
  
  openModal(content: any, user?: User) {
    this.selectedUser = user || null;
    if (user) {
      this.editUser = { ...user };
      this.roleUpdate = { role: user.role };
    } else {
      this.editUser = {};
      this.roleUpdate = { role: UserRole.USER };
    }
    this.activeModal = this.modalService.open(content, { size: 'lg' });
  }
  
  onPageChange(page: number) {
    this.page = page;
    this.loadUsers();
  }
  
  applyFilters() {
    this.page = 1;
    this.loadUsers();
  }
  
  clearFilters() {
    this.filters = {
      role: '' as UserRole | '',
      status: '' as UserStatus | '',
      search: '',
      department: ''
    };
    this.applyFilters();
  }
}
