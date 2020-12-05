import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-author-search',
  templateUrl: './author-search.component.html',
  styleUrls: ['./author-search.component.scss', '../genre-search/genre-search.component.scss'],
  host: {
    class: 'management-main'
  }
})
export class AuthorSearchComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
