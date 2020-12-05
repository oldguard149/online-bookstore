import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GenreSearchComponent } from './components/genre-search/genre-search.component';
import { ManagementIndexComponent } from './components/management-index/management-index.component';
import { SearchResultComponent } from './components/search-result/search-result.component';

const routes: Routes = [
  {
    path: '', component: ManagementIndexComponent,
    children: [
      { path: 'search/genre', component: GenreSearchComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementRoutingModule { }
