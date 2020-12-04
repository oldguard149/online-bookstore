import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopnavComponent } from './topnav/topnav.component';
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';
import { AlertComponent } from './alert/alert.component';



@NgModule({
  declarations: [
    TopnavComponent,
    AlertComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ],
  exports: [
    TopnavComponent,
    AlertComponent
  ]
})
export class SharedComponentsModule { }
