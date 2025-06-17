import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/layout/layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./authen/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'first',
        loadComponent: () => import('./features/first/first.component').then(m => m.FirstComponent)
      },
      {
        path: 'second',
        loadComponent: () => import('./features/second/second.component').then(m => m.SecondComponent)
      },
      {
        path: 'user-management',
        loadComponent: () => import('./pages/user/user-management/user-management.component').then(m => m.UserManagementComponent)
      },  
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];