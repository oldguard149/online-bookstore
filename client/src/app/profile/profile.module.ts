import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileIndexComponent } from './components/profile-index/profile-index.component';
import { ProfileSidenavComponent } from './components/profile-sidenav/profile-sidenav.component';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { MaterialModule } from '../material.module';
import { ProfileService } from './services/profile.service';
import { SharedComponentsModule } from '../shared-components/shared-components.module';


@NgModule({
  declarations: [
    ProfileIndexComponent, 
    ProfileSidenavComponent, 
    UserInfoComponent, 
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedComponentsModule
  ],
  providers: [
    ProfileService
  ]
})
export class ProfileModule { }
