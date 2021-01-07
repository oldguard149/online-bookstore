import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ProfileIndexComponent } from './components/profile-index/profile-index.component';
import { UserInfoComponent } from './components/user-info/user-info.component';

const routes: Routes = [
  { path: '', component: ProfileIndexComponent, 
  children: [
    { path: 'profile', component: UserInfoComponent },
    { path: 'change-password', component: ChangePasswordComponent },
  ]}
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
