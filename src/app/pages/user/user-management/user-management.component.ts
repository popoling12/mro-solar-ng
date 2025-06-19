import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { UserService, User, UserRole, UserStatus, UserCreate, UserUpdate, UserRoleUpdate, UserStats } from '../../../services/user.service';
import { AuthenService } from '../../../services/authen.service';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
  
@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzModalModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzCardModule,
    NzStatisticModule,
    NzGridModule,
    NzAlertModule,
    NzPaginationModule,
    NzSpinModule,
    NzBadgeModule,
    NzIconModule,
    NzDividerModule,
    NzSpaceModule,
    NzPopconfirmModule,
    NzAvatarModule,
    NzTagModule,
    NzToolTipModule
  ],
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
  
  currentUser: any = null;

  // ✨ เพิ่ม Math object สำหรับใช้ใน template
  Math = Math;
  
  // Icons for statistics
  userIcon = 'user';
  activeUserIcon = 'check-circle';
  inactiveUserIcon = 'close-circle';
  departmentIcon = 'bank';
  
  constructor(
    private userService: UserService,
    private authService: AuthenService,
    private modalService: NzModalService
  ) {}
  
  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadPermissions();
    this.loadAvailableRoles();
    this.loadUsers();
    this.loadStats();
  }

  // ✨ เพิ่ม trackBy function สำหรับ performance
  trackByUserId(index: number, user: User): any {
    return user.id;
  }

  // ✨ เพิ่ม helper method สำหรับแปลงสถานะเป็นภาษาไทย
  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'active': 'ใช้งานอยู่',
      'inactive': 'ไม่ได้ใช้งาน', 
      'pending': 'รอการยืนยัน',
      'suspended': 'ระงับการใช้งาน'
    };
    return statusMap[status] || status;
  }

  // ✨ เพิ่ม helper method สำหรับ validation
  isFormValid(formType: 'create' | 'edit'): boolean {
    if (formType === 'create') {
      return !!(this.newUser.email && 
                this.newUser.password && 
                this.newUser.role &&
                this.isValidEmail(this.newUser.email));
    } else {
      return !!(this.editUser.email && 
                this.isValidEmail(this.editUser.email || ''));
    }
  }

  // ✨ เพิ่ม email validation
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // ✨ เพิ่ม method สำหรับ reset form
  resetNewUserForm(): void {
    this.newUser = {
      email: '',
      password: '',
      role: UserRole.USER,
      department: ''
    };
  }

  // ✨ เพิ่ม method สำหรับ reset edit form
  resetEditForm(): void {
    this.editUser = {};
    this.roleUpdate = { role: UserRole.USER };
    this.selectedUser = null;
  }

  // ✨ ปรับปรุง error handling
  handleError(error: any, action: string): void {
    console.error(`Failed to ${action}:`, error);
    
    const errorMessages: { [key: string]: string } = {
      'load_users': 'ไม่สามารถโหลดข้อมูลผู้ใช้ได้',
      'load_permissions': 'ไม่สามารถโหลดสิทธิ์การใช้งานได้',
      'create_user': 'ไม่สามารถสร้างผู้ใช้ได้',
      'update_user': 'ไม่สามารถอัปเดตผู้ใช้ได้',
      'delete_user': 'ไม่สามารถลบผู้ใช้ได้',
      'reset_password': 'ไม่สามารถรีเซ็ตรหัสผ่านได้'
    };

    this.errorMessage = errorMessages[action] || 'เกิดข้อผิดพลาดในระบบ';
    
    // Auto clear error after 5 seconds
    setTimeout(() => {
      this.errorMessage = '';
    }, 5000);
  }
  
  loadPermissions() {
    this.userService.checkUserPermissions().subscribe({
      next: (permissions) => {
        this.permissions = permissions;
      },
      error: (error) => {
        this.handleError(error, 'load_permissions');
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
        this.handleError(error, 'load_users');
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
    if (!this.isFormValid('create')) {
      this.errorMessage = 'กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง';
      return;
    }

    this.isCreating = true;
    this.userService.createUser(this.newUser).subscribe({
      next: (response) => {
        this.loadUsers();
        this.loadStats();
        this.isCreating = false;
        this.resetNewUserForm();
        this.activeModal?.close();
        
        // Show success message
        this.showSuccessMessage('สร้างผู้ใช้สำเร็จแล้ว');
      },
      error: (error) => {
        this.handleError(error, 'create_user');
        this.isCreating = false;
      }
    });
  }

  // ✨ เพิ่ม success message helper
  showSuccessMessage(message: string): void {
    // คุณสามารถใช้ toast service หรือ alert ได้
    console.log('Success:', message);
    // หรือเพิ่ม property สำหรับ success message
  }
  
  updateUser(userId: number) {
    if (!userId || !this.isFormValid('edit')) {
      this.errorMessage = 'กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง';
      return;
    }
    
    this.isUpdating = true;
    // First update user details
    this.userService.updateUser(userId, this.editUser).subscribe({
      next: (response) => {
        // Then update user role
        this.userService.updateUserRole(userId, this.roleUpdate).subscribe({
          next: (roleResponse) => {
            this.loadUsers();
            this.isUpdating = false;
            this.resetEditForm();
            this.activeModal?.close();
            this.showSuccessMessage('อัปเดตผู้ใช้สำเร็จแล้ว');
          },
          error: (error) => {
            this.handleError(error, 'update_user');
            this.isUpdating = false;
          }
        });
      },
      error: (error) => {
        this.handleError(error, 'update_user');
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
        this.resetEditForm();
        this.activeModal?.close();
        this.showSuccessMessage('อัปเดตบทบาทผู้ใช้สำเร็จแล้ว');
      },
      error: (error) => {
        this.handleError(error, 'update_user');
        this.isUpdating = false;
      }
    });
  }

  // ✨ ปรับปรุง delete confirmation ให้ดีขึ้น
  deleteUser(userId: number) {
    if (!userId) return;
    
    const user = this.users.find(u => u.id === userId);
    const confirmMessage = `คุณต้องการลบผู้ใช้ "${user?.email}" ใช่หรือไม่?\n\nการดำเนินการนี้ไม่สามารถยกเลิกได้`;
    
    if (confirm(confirmMessage)) {
      this.userService.deleteUser(userId).subscribe({
        next: (response) => {
          this.loadUsers();
          this.loadStats();
          this.showSuccessMessage('ลบผู้ใช้สำเร็จแล้ว');
        },
        error: (error) => {
          this.handleError(error, 'delete_user');
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
        this.showSuccessMessage('กู้คืนผู้ใช้สำเร็จแล้ว');
      },
      error: (error) => {
        console.error('Failed to restore user:', error);
        this.errorMessage = 'ไม่สามารถกู้คืนผู้ใช้ได้';
      }
    });
  }
  
  resetUserPassword(userId: number) {
    if (!userId) return;
    
    const user = this.users.find(u => u.id === userId);
    const confirmMessage = `คุณต้องการรีเซ็ตรหัสผ่านของ "${user?.email}" ใช่หรือไม่?`;
    
    if (confirm(confirmMessage)) {
      this.userService.resetUserPassword(userId).subscribe({
        next: (response) => {
          alert(`รหัสผ่านชั่วคราวใหม่:\n${response.message}\n\nกรุณาแจ้งให้ผู้ใช้ทราบ`);
        },
        error: (error) => {
          this.handleError(error, 'reset_password');
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
      this.resetNewUserForm();
      this.roleUpdate = { role: UserRole.USER };
    }
    
    // Clear any existing error messages
    this.errorMessage = '';
    
    this.activeModal = this.modalService.create({
      nzContent: content,
      nzClosable: false,
      nzMaskClosable: false,
      nzWidth: '500px'
    });
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

  // ✨ เพิ่ม method สำหรับ modal management
  closeModal(): void {
    this.activeModal?.destroy();
    this.resetEditForm();
    this.resetNewUserForm();
    this.errorMessage = '';
  }

  dismissModal(): void {
    this.activeModal?.destroy();
    this.resetEditForm();
    this.resetNewUserForm();
    this.errorMessage = '';
  }

  // Helper method for status color
  getStatusColor(status: string): string {
    const colorMap: { [key: string]: string } = {
      'active': 'success',
      'inactive': 'error',
      'pending': 'warning',
      'suspended': 'default'
    };
    return colorMap[status] || 'default';
  }

  // Helper method for status icon
  getStatusIcon(status: string): string {
    const iconMap: { [key: string]: string } = {
      'active': 'check-circle',
      'inactive': 'close-circle',
      'pending': 'clock-circle',
      'suspended': 'pause-circle'
    };
    return iconMap[status] || 'question-circle';
  }
}