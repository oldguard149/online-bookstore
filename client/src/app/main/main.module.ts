import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { IndexPageComponent } from './components/index-page/index-page.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { MaterialModule } from '../material.module';
import { BookcardComponent } from './components/bookcard/bookcard.component';
import { IndexBooklistComponent } from './components/index-booklist/index-booklist.component';
import { DataService } from './services/data.service';
import { GenreListComponent } from './components/genre-list/genre-list.component';
import { SideAdComponent } from './components/side-ad/side-ad.component';
import { SideAdBookcardComponent } from './components/side-ad-bookcard/side-ad-bookcard.component';
import { AuthorListComponent } from './components/author-list/author-list.component';
import { PublisherListComponent } from './components/publisher-list/publisher-list.component';
import { TitleTooltipDirective } from './directives/title-tooltip.directive';
import { GenreDetailComponent } from './components/genre-detail/genre-detail.component';
import { PublisherDetailComponent } from './components/publisher-detail/publisher-detail.component';
import { AuthorDetailComponent } from './components/author-detail/author-detail.component';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { BooklistComponent } from './components/booklist/booklist.component';
import { SharedComponentsModule } from '../shared-components/shared-components.module';
import { BookDetailComponent } from './components/book-detail/book-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CartComponent } from './components/cart/cart.component';
import { CartItemComponent } from './components/cart-item/cart-item.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { BillService } from './services/bill.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@NgModule({
  declarations: [
    IndexPageComponent, 
    SidenavComponent,
    BookcardComponent, 
    IndexBooklistComponent, 
    GenreListComponent, 
    SideAdComponent, 
    SideAdBookcardComponent, 
    AuthorListComponent, 
    PublisherListComponent,
    TitleTooltipDirective,
    GenreDetailComponent,
    PublisherDetailComponent,
    AuthorDetailComponent,
    PaginatorComponent,
    BooklistComponent,
    BookDetailComponent,
    CartComponent,
    CartItemComponent,
    CheckoutComponent,
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    MaterialModule,
    SharedComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule
  ],
  providers: [
    DataService,
    BillService
  ]
})
export class MainModule { }