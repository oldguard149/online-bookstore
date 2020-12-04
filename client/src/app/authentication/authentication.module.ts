import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MaterialModule } from '../material.module';
import { SharedComponentsModule } from '../shared-components/shared-components.module';
import { AuthIndexComponent } from './components/auth-index/auth-index.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    AuthIndexComponent
  ],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    MaterialModule,
    SharedComponentsModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class AuthenticationModule { }
