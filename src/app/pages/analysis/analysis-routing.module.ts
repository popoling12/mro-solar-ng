import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrendComponent } from './trend/trend.component';

const routes: Routes = [
  {
    path: 'trend',
    component: TrendComponent
  },
  {
    path: '',
    redirectTo: 'trend',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalysisRoutingModule { }  