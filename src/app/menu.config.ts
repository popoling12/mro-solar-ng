import { NzIconModule } from 'ng-zorro-antd/icon';

export interface MenuItem {
  title: string;
  icon?: string;
  link?: string;
  children?: MenuItem[];
}

export const MENU_CONFIG: MenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'dashboard-outline',
    children: [
      {
        title: 'Overview Plants',
        link: '/dashboard/overview-plants'
      },
      {
        title: 'User Management',
        link: '/user-management'
      },
      {
        title: 'Home',
        link: '/home'
      },
      {
        title: 'Workplace',
        link: '/workplace'
      }
    ]
  },
  {
    title: 'Assets Management',
    icon: 'database-outline',
    children: [
      {
        title: 'All Assets',
        link: '/assets'
      },
      {
        title: 'Asset Templates',
        link: '/assets/templates'
      },
      {
        title: 'Locations',
        link: '/assets/locations'
      },
      {
        title: 'Inventory',
        link: '/assets/inventory'
      }
    ]
  },
  {
    title: 'Form',
    icon: 'form-outline',
    children: [
      {
        title: 'Basic Form',
        link: '/basic-form'
      }
    ]
  },
  {
    title: 'Analysis',
    icon: 'analysis-outline',
    link: '/analysis',
    children: [
      {
        title: 'Trend',
        link: '/analysis/trend'
      }
    ]
  } 
]; 