import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {AuthGuard} from "./guard/auth.guard";
import {JournalComponent} from "./journal/journal.component";
import {AddNewComponent} from "./journal/add-new/add-new.component";
import {SignupComponent} from "./signup/signup.component";
import {PasswordResetComponent} from "./password-reset/password-reset.component";

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'forgot-password',
    component: PasswordResetComponent
  },
  {
    path: 'journals',
    component: JournalComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'journal/add-new',
    component: AddNewComponent,
    canActivate: [AuthGuard]
  },
  { path: '', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
