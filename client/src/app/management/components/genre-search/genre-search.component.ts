import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-genre-search',
  templateUrl: './genre-search.component.html',
  styleUrls: ['./genre-search.component.scss'],
  host: {
    class: 'management-main'
  }
})
export class GenreSearchComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }
}
