import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-publisher-search',
  templateUrl: './publisher-search.component.html',
  styleUrls: ['./publisher-search.component.scss', '../genre-search/genre-search.component.scss'],
  host: {
    class: 'management-main'
  }
})
export class PublisherSearchComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
