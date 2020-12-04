import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthIndexComponent } from './components/auth-index/auth-index.component';
import { LoginComponent } from './components/login/login.component';


const routes: Routes = [
  {
    path: '', component: AuthIndexComponent,
    children: [
      { path: 'login', component: LoginComponent },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
