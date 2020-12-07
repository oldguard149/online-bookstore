import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthIndexComponent } from './components/auth-index/auth-index.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';


const routes: Routes = [
  {
    path: '', component: AuthIndexComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'sign-up', component: RegisterComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
