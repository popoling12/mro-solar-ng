import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User, UserRole } from '../../services/user.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
  standalone: true,
  imports: [NgbNavModule, CommonModule]
})
export class SideNavComponent implements OnInit {
  activeTab = 'first';
  selectedUser: User | null = null;
  editUser: Partial<User> = {};
  roleUpdate: Partial<User> = { role: UserRole.USER };
  activeModal: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    const currentUrl = this.router.url;
    if (currentUrl.includes('/second')) {
      this.activeTab = 'second';
    } else if (currentUrl.includes('/home')) {
      this.activeTab = 'home';
    } else if (currentUrl.includes('/user-management')) {
      this.activeTab = 'user-management';
    } else {
      this.activeTab = 'first';
    }
  }

  navigateToTab(tabId: string) {
    this.activeTab = tabId;
    this.router.navigate(['/', tabId], { relativeTo: this.route });
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
} 