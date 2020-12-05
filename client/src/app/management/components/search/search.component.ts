import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'management-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @Input() nameKey: string; // ex: 'name', 'fullname'
  @Input() idKey: string; // ex: 'isbn', 'genre_id'
  @Input() objectType: string; // ex: 'book', 'genre'
  searchData: any;
  totalItems: number;
  pageIndex: number;
  pageSize: number;
  urlPath: string;
  constructor() { }

  ngOnInit(): void {
    this.urlPath = this.objectType;
  }

  getSearchData(data: any) {
    this.searchData = data['data'];
    this.totalItems = data['totalItems'];
    this.pageIndex = data['pageIndex'];
    this.pageSize = data['pageSize']
  }

}
