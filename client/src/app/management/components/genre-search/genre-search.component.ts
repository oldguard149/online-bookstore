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
  searchData: any;
  totalItems: number;
  pageIndex: number;
  pageSize: number;
  constructor() { }

  ngOnInit(): void {
  }

  getSearchData(data: any) {
    console.log('here');

    this.searchData = data['data'];
    this.totalItems = data['totalItems'];
    this.pageIndex = data['pageIndex'];
    this.pageSize = data['pageSize']
  }

}
