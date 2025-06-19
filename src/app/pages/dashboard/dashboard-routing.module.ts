import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'overview-plants',
        loadComponent: () => import('./overview-plants/overview-plants.component').then(m => m.OverviewPlantsComponent)
      },
      {
        path: '',
        redirectTo: 'overview-plants',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { } 