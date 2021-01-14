import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { SubSink } from 'subsink';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-main-search',
  templateUrl: './main-search.component.html',
  styleUrls: ['./main-search.component.scss']
})
export class MainSearchComponent implements OnInit {
  displayedColumns = ['name', 'option'];
  searchResult: any;
  form: FormGroup;
  totalItems: number;
  currentPage: number = 0;
  pageSize: number = 10;
  private subs = new SubSink();
  private validSeachType = new Set(['book', 'genre', 'publisher', 'genre']);
  constructor(
    private _route: ActivatedRoute,
    private _fb: FormBuilder,
    private _data: DataService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.form = this._fb.group({
      searchtext: ['', Validators.required],
      type: ['', Validators.required],
      pagesize: ['10', Validators.required]
    })
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  fetchSearchResult(): void {
    this.subs.sink = this._route.params.subscribe(params => {
      const searchtext = params['search'];
      const currentPage = this.getValidPaginationNumber(params['page'], 0);
      const pageSize = this.getValidPaginationNumber(params['pagesize'], 10);
      let searchType: any;
      this.validSeachType.has(params['type']) ? searchType = params['type'] : searchType = 'book';

      this.currentPage = currentPage;
      this.pageSize = pageSize;
      if (searchtext !== undefined) {
        this.form.patchValue({
          searchtext: searchtext.replace(/\+/gi, ' '),
          type: searchType,
          pagesize: pageSize
        });
        this.subs.sink = this._data.search(searchType, searchtext.replace(/ /gi, '+'), currentPage, pageSize)
          .subscribe(data => {
            this.searchResult = data.searchResult;
            this.totalItems = data.totalItems;
          })

      }
    })
  }

  getValidPaginationNumber(checkValue: any, defaultValue: number): number {
    if (isNaN(checkValue) || Number(checkValue) < 0) {
      return defaultValue;
    }
    return parseInt(checkValue);
  }

  handlePageChange(page: PageEvent) {
    this._router.navigate([], {
      queryParams: {
        'page': page.pageIndex,
        'pageSize': page.pageSize
      },
      queryParamsHandling: 'merge'
    });
  }
}
