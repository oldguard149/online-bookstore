import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedComponentsModule } from '../shared-components/shared-components.module';

import { RequestToApiService } from './services/request-to-api.service';
import { ManagementService } from './services/management.service';

import { ManagementRoutingModule } from './management-routing.module';
import { ManagementIndexComponent } from './components/management-index/management-index.component';
import { ManagementSidenavComponent } from './components/management-sidenav/management-sidenav.component';
import { SearchResultComponent } from './components/search-result/search-result.component';
import { SearchFormComponent } from './components/search-form/search-form.component';
import { GenreFormComponent } from './components/genre-form/genre-form.component';
import { GenreCreateComponent } from './components/genre-create/genre-create.component';
import { GenreUpdateComponent } from './components/genre-update/genre-update.component';
import { GenreDeleteComponent } from './components/genre-delete/genre-delete.component';
import { GenreSearchComponent } from './components/genre-search/genre-search.component';
import { BookCreateComponent } from './components/book-create/book-create.component';
import { BookUpdateComponent } from './components/book-update/book-update.component';
import { BookDeleteComponent } from './components/book-delete/book-delete.component';
import { BookFormComponent } from './components/book-form/book-form.component';
import { BookSearchComponent } from './components/book-search/book-search.component';
import { SearchComponent } from './components/search/search.component';
import { PublisherSearchComponent } from './components/publisher-search/publisher-search.component';
import { AuthorSearchComponent } from './components/author-search/author-search.component';
import { AuthorUpdateComponent } from './components/author-update/author-update.component';
import { AuthorDeleteComponent } from './components/author-delete/author-delete.component';
import { PublisherFormComponent } from './components/publisher-form/publisher-form.component';
import { PublisherCreateComponent } from './components/publisher-create/publisher-create.component';
import { PublisherUpdateComponent } from './components/publisher-update/publisher-update.component';
import { PublisherDeleteComponent } from './components/publisher-delete/publisher-delete.component';



@NgModule({
  declarations: [
    ManagementIndexComponent,
    ManagementSidenavComponent,
    SearchResultComponent,
    SearchFormComponent,
    GenreFormComponent,
    GenreCreateComponent,
    GenreUpdateComponent,
    GenreDeleteComponent,
    GenreSearchComponent,
    BookCreateComponent,
    BookUpdateComponent,
    BookDeleteComponent,
    BookFormComponent,
    BookSearchComponent,
    SearchComponent,
    PublisherSearchComponent,
    AuthorSearchComponent,
    AuthorUpdateComponent,
    AuthorDeleteComponent,
    PublisherFormComponent,
    PublisherCreateComponent,
    PublisherUpdateComponent,
    PublisherDeleteComponent,
  ],
  imports: [
    CommonModule,
    ManagementRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    SharedComponentsModule
  ],
  providers: [
    RequestToApiService,
    ManagementService
  ]
})
export class ManagementModule { }
