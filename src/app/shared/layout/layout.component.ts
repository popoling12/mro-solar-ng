import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterOutlet } from '@angular/router';
import { SideNavComponent } from '../side-nav/side-nav.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  imports: [NgbNavModule, RouterOutlet,SideNavComponent],
  standalone: true
})
export class LayoutComponent implements OnInit {
  activeTab = 'first';

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Set active tab based on current route
    const currentUrl = this.router.url;
    if (currentUrl.includes('/second')) {
      this.activeTab = 'second';
    } else if (currentUrl.includes('/home')) {
      this.activeTab = 'home';
    } else {
      this.activeTab = 'first';
    }
  }

  navigateToTab(tabId: string) {
    this.activeTab = tabId;
    // Navigate to the root path with the tab as a parameter
    this.router.navigate(['/', tabId], { relativeTo: this.route });
  }
}
