import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenService } from '../../services/authen.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginData = {
    email: '',
    password: ''
  };
  errorMessage: string = '';
  isLoading: boolean = false;
  isCheckingAuth: boolean = true;

  constructor(
    private router: Router,
    private authService: AuthenService
  ) {}

  async ngOnInit() {
    // รอให้ auth service initialize และตรวจสอบว่า user login แล้วหรือไม่
    try {
      const isAuthenticated = await this.authService.waitForInitialization();
      if (isAuthenticated) {
        this.router.navigate(['/home']);
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
    } finally {
      this.isCheckingAuth = false;
    }
  }

  onSubmit() {
    if (!this.loginData.email || !this.loginData.password) {
      this.errorMessage = 'กรุณากรอกอีเมลและรหัสผ่าน';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginData.email, this.loginData.password).subscribe({
      next: (user) => {
        console.log('Login successful:', user);
        this.isLoading = false;
        
        // Navigate to home page
        this.router.navigate(['/home']).then(success => {
          if (!success) {
            console.error('Navigation failed');
            this.errorMessage = 'ไม่สามารถเข้าสู่ระบบได้ กรุณาลองใหม่อีกครั้ง';
          }
        });
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.isLoading = false;
        
        if (error.status === 401) {
          this.errorMessage = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
        } else if (error.status === 422) {
          this.errorMessage = 'ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบอีเมลและรหัสผ่าน';
        } else {
          this.errorMessage = 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง';
        }
      }
    });
  }
}