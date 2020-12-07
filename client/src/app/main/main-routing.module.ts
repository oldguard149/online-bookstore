import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorDetailComponent } from './components/author-detail/author-detail.component';
import { AuthorListComponent } from './components/author-list/author-list.component';
import { BookDetailComponent } from './components/book-detail/book-detail.component';
import { GenreDetailComponent } from './components/genre-detail/genre-detail.component';
import { GenreListComponent } from './components/genre-list/genre-list.component';
import { IndexBooklistComponent } from './components/index-booklist/index-booklist.component';
import { IndexPageComponent } from './components/index-page/index-page.component';
import { PublisherDetailComponent } from './components/publisher-detail/publisher-detail.component';
import { PublisherListComponent } from './components/publisher-list/publisher-list.component';


const routes: Routes = [
  {
    path: '', component: IndexPageComponent,
    children: [
      { path: '', component: IndexBooklistComponent },
      { path: 'genre', component: GenreListComponent },
      { path: 'author', component: AuthorListComponent },
      { path: 'publisher', component: PublisherListComponent },
      { path: 'genre/:id', component: GenreDetailComponent },
      { path: 'publisher/:id', component: PublisherDetailComponent },
      { path: 'author/:id', component: AuthorDetailComponent },
      { path: 'book/:isbn', component: BookDetailComponent}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }