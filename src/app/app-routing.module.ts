import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvestmentComponent } from './pages/investment/investment.component';

const routes: Routes = [
  {
    path:'',component:InvestmentComponent
  },
  {
    path:'investment',component:InvestmentComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
