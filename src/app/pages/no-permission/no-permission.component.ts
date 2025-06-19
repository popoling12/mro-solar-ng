import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-no-permission',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6 text-center">
          <h1 class="display-4 mb-4">ไม่สามารถเข้าถึงหน้านี้ได้</h1>
          <p class="lead mb-4">คุณไม่มีสิทธิ์ในการเข้าถึงหน้านี้ กรุณาติดต่อผู้ดูแลระบบ</p>
          <a routerLink="/home" class="btn btn-primary">กลับหน้าหลัก</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      min-height: 60vh;
      display: flex;
      align-items: center;
    }
  `]
})
export class NoPermissionComponent {} 