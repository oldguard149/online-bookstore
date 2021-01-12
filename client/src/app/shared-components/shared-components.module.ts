import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopnavComponent } from './topnav/topnav.component';
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';
import { AlertComponent } from './alert/alert.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
    TopnavComponent,
    AlertComponent,
    PageNotFoundComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    MatButtonModule
  ],
  exports: [
    TopnavComponent,
    AlertComponent
  ]
})
export class SharedComponentsModule { }
