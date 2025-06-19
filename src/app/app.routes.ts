import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/welcome' },
  { path: 'login', loadComponent: () => import('./authen/login/login.component').then(m => m.LoginComponent) },
  { path: 'first', loadComponent: () => import('./features/first/first.component').then(m => m.FirstComponent), canActivate: [authGuard] },
  { path: 'welcome', loadComponent: () => import('./pages/welcome/welcome.component').then(m => m.WelcomeComponent) },
  { path: 'report', loadComponent: () => import('./pages/report/report.component').then(m => m.ReportComponent) },
  { path: 'profile', loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent) },
  { path: 'home', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent), canActivate: [authGuard] },
  { path: 'user-management', loadComponent: () => import('./pages/user/user-management/user-management.component').then(m => m.UserManagementComponent), canActivate: [authGuard, roleGuard('super_admin')] },
  { 
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [authGuard]
  },
  {
    path: 'assets',
    loadChildren: () => import('./pages/assets/assets.module').then(m => m.AssetsModule),
    canActivate: [authGuard]
  },
  {
    path: 'analysis',
    loadChildren: () => import('./pages/analysis/analysis-routing.module').then(m => m.AnalysisRoutingModule),
    canActivate: [authGuard]
  }
];