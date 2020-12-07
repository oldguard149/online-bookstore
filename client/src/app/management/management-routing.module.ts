import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorSearchComponent } from './components/author-search/author-search.component';
import { BookCreateComponent } from './components/book-create/book-create.component';
import { BookSearchComponent } from './components/book-search/book-search.component';
import { BookUpdateComponent } from './components/book-update/book-update.component';
import { GenreCreateComponent } from './components/genre-create/genre-create.component';
import { GenreSearchComponent } from './components/genre-search/genre-search.component';
import { GenreUpdateComponent } from './components/genre-update/genre-update.component';
import { ManagementIndexComponent } from './components/management-index/management-index.component';
import { PublisherCreateComponent } from './components/publisher-create/publisher-create.component';
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
      { path: 'update/publisher/:isbn', component: PublisherUpdateComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementRoutingModule { }
