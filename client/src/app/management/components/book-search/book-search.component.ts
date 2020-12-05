import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss'],
  host: {
    class: 'management-main'
  }
})
export class BookSearchComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }

}
