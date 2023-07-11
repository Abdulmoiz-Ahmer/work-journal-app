import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {PointsComponent} from "./points/points.component";
import {AuthGuard} from "./guard/auth.guard";
import {TransactionsComponent} from "./transactions/transactions.component";

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'parts',
    component: PointsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'requests',
    component: TransactionsComponent,
    canActivate: [AuthGuard]
  },
  { path: '', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
