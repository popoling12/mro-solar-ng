import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService, User, UserUpdate, UserPasswordChange } from '../../services/user.service';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCardModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  profileForm: FormGroup;
  passwordForm: FormGroup;
  isLoading = false;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private message: NzMessageService
  ) {
    this.profileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      department: ['']
    });

    this.passwordForm = this.fb.group({
      current_password: ['', Validators.required],
      new_password: ['', [Validators.required, Validators.minLength(8)]],
      confirm_password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.user = user;
        this.profileForm.patchValue({
          email: user.email,
          department: user.department
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        this.message.error('Failed to load profile');
        this.isLoading = false;
      }
    });
  }

  updateProfile(): void {
    if (this.profileForm.valid) {
      this.isLoading = true;
      const updateData: UserUpdate = this.profileForm.value;
      
      this.userService.updateCurrentUser(updateData).subscribe({
        next: (response) => {
          this.message.success('Profile updated successfully');
          this.loadUserProfile();
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          this.message.error('Failed to update profile');
          this.isLoading = false;
        }
      });
    }
  }

  changePassword(): void {
    if (this.passwordForm.valid) {
      if (this.passwordForm.get('new_password')?.value !== this.passwordForm.get('confirm_password')?.value) {
        this.message.error('New passwords do not match');
        return;
      }

      this.isLoading = true;
      const passwordData: UserPasswordChange = {
        current_password: this.passwordForm.get('current_password')?.value,
        new_password: this.passwordForm.get('new_password')?.value
      };

      this.userService.changePassword(passwordData).subscribe({
        next: (response) => {
          this.message.success('Password changed successfully');
          this.passwordForm.reset();
        },
        error: (error) => {
          console.error('Error changing password:', error);
          this.message.error('Failed to change password');
          this.isLoading = false;
        }
      });
    }
  }
}
