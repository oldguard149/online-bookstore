import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorDeleteComponent } from './components/author-delete/author-delete.component';
import { AuthorSearchComponent } from './components/author-search/author-search.component';
import { AuthorUpdateComponent } from './components/author-update/author-update.component';
import { BillDetailComponent } from './components/bill-detail/bill-detail.component';
import { BillListComponent } from './components/bill-list/bill-list.component';
import { BookCreateComponent } from './components/book-create/book-create.component';
import { BookDeleteComponent } from './components/book-delete/book-delete.component';
import { BookSearchComponent } from './components/book-search/book-search.component';
import { BookUpdateComponent } from './components/book-update/book-update.component';
import { EmpCreateComponent } from './components/emp-create/emp-create.component';
import { EmpDeleteComponent } from './components/emp-delete/emp-delete.component';
import { EmpSearchComponent } from './components/emp-search/emp-search.component';
import { EmpUpdateComponent } from './components/emp-update/emp-update.component';
import { GenreCreateComponent } from './components/genre-create/genre-create.component';
import { GenreDeleteComponent } from './components/genre-delete/genre-delete.component';
import { GenreSearchComponent } from './components/genre-search/genre-search.component';
import { GenreUpdateComponent } from './components/genre-update/genre-update.component';
import { ImportStockComponent } from './components/import-stock/import-stock.component';
import { ManagementIndexComponent } from './components/management-index/management-index.component';
import { PublisherCreateComponent } from './components/publisher-create/publisher-create.component';
import { PublisherDeleteComponent } from './components/publisher-delete/publisher-delete.component';
import { PublisherSearchComponent } from './components/publisher-search/publisher-search.component';
import { PublisherUpdateComponent } from './components/publisher-update/publisher-update.component';

const routes: Routes = [
  {
    path: '', component: ManagementIndexComponent,
    children: [
      { path: 'search/genre', component: GenreSearchComponent },
      { path: 'search/book', component: BookSearchComponent },
      { path: 'search/publisher', component: PublisherSearchComponent },
      { path: 'search/author', component: AuthorSearchComponent },

      { path: 'create/genre', component: GenreCreateComponent },
      { path: 'create/book', component: BookCreateComponent },
      { path: 'create/publisher', component: PublisherCreateComponent },

      { path: 'update/genre/:id', component: GenreUpdateComponent },
      { path: 'update/book/:isbn', component: BookUpdateComponent },
      { path: 'update/publisher/:id', component: PublisherUpdateComponent },
      { path: 'update/author/:id', component: AuthorUpdateComponent },

      { path: 'delete/genre/:id', component: GenreDeleteComponent },
      { path: 'delete/book/:isbn', component: BookDeleteComponent },
      { path: 'delete/publisher/:id', component: PublisherDeleteComponent },
      { path: 'delete/author/:id', component: AuthorDeleteComponent },

      { path: 'search/employee', component: EmpSearchComponent },
      { path: 'create/employee', component: EmpCreateComponent },
      { path: 'update/employee/:id', component: EmpUpdateComponent },
      { path: 'delete/employee/:id', component: EmpDeleteComponent },

      { path: 'bills', component: BillListComponent },
      { path: 'bill/:id', component: BillDetailComponent },
      { path: 'import-stock', component: ImportStockComponent},
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementRoutingModule { }
