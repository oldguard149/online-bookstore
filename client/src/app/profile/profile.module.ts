import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileIndexComponent } from './components/profile-index/profile-index.component';
import { ProfileSidenavComponent } from './components/profile-sidenav/profile-sidenav.component';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { MaterialModule } from '../material.module';
import { SharedComponentsModule } from '../shared-components/shared-components.module';
import { BillListComponent } from './components/bill-list/bill-list.component';
import { BillDetailComponent } from './components/bill-detail/bill-detail.component';


@NgModule({
  declarations: [
    ProfileIndexComponent, 
    ProfileSidenavComponent, 
    UserInfoComponent, 
    ChangePasswordComponent, BillListComponent, BillDetailComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedComponentsModule
  ],  
})
export class ProfileModule { }
