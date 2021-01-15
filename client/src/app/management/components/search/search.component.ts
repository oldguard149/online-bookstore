import { Component, Input, OnInit } from '@angular/core';
import { FlashMessageService } from 'src/app/shared/services/flash-message.service';

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
  constructor(
    private _flash: FlashMessageService
  ) { }

  ngOnDestroy() {
    this._flash.initialize();
  }

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
