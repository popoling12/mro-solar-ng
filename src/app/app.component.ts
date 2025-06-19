import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { MENU_CONFIG, MenuItem } from './menu.config';
import { CommonModule } from '@angular/common';
import { 
  MenuFoldOutline, 
  MenuUnfoldOutline, 
  DashboardOutline,
  FormOutline
} from '@ant-design/icons-angular/icons';
import { IconDefinition } from '@ant-design/icons-angular';
import { NzIconService } from 'ng-zorro-antd/icon';

const icons: IconDefinition[] = [
  MenuFoldOutline,
  MenuUnfoldOutline,
  DashboardOutline,
  FormOutline
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    NzIconModule,
    NzLayoutModule,
    NzMenuModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  isCollapsed = false;
  menuConfig: MenuItem[] = MENU_CONFIG;

  constructor(private iconService: NzIconService) {
    // Register icons
    icons.forEach(icon => {
      this.iconService.addIcon(icon);
    });
  }
}
