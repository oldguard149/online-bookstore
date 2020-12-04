import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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


@NgModule({
  declarations: [ManagementIndexComponent, ManagementSidenavComponent, SearchResultComponent, SearchFormComponent, GenreFormComponent, GenreCreateComponent, GenreUpdateComponent, GenreDeleteComponent, GenreSearchComponent],
  imports: [
    CommonModule,
    ManagementRoutingModule
  ]
})
export class ManagementModule { }
