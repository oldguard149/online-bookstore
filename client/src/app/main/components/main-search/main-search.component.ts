import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { SubSink } from 'subsink';
import { isBoolean } from 'util';
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
  idKey: string = 'isbn';
  nameKey: string = 'name';
  searchType: any = 'book';
  private subs = new SubSink();
  private validSeachType = new Set(['book', 'genre', 'publisher', 'author']);
  constructor(
    private _route: ActivatedRoute,
    private _fb: FormBuilder,
    private _data: DataService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.form = this._fb.group({
      searchtext: ['', Validators.required],
      type: ['book', Validators.required],
      pagesize: [10, Validators.required]
    });
    this.fetchSearchResult();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  fetchSearchResult(): void {
    this.subs.sink = this._route.queryParams.subscribe(params => {
      const searchtext = params['search'];
      const currentPage = this.getValidPaginationNumber(params['page'], 0);
      const pageSize = this.getValidPaginationNumber(params['pagesize'], 10);
      this.validSeachType.has(params['type']) ? this.searchType = params['type'] : this.searchType = 'book';

      this.idKey = this.searchObject[this.searchType].id;
      this.nameKey = this.searchObject[this.searchType].name;
      this.currentPage = currentPage;
      this.pageSize = pageSize;
      if (searchtext !== undefined) {
        this.form.patchValue({
          searchtext: searchtext.replace(/\+/gi, ' '),
          type: this.searchType,
          pagesize: pageSize
        });
        this.subs.sink = this._data.search(this.searchType, searchtext.replace(/ /gi, '+'), currentPage, pageSize)
          .subscribe(data => {
            this.searchResult = data.result;
            this.totalItems = data.totalItems;
          })

      }
    })
  }

  onSubmit() {
    this._router.navigate([], {
      queryParams: {
        search: this.searchText.value,
        page: this.currentPage,
        pagesize: this.formPagesize.value,
        type: this.formSearchType.value
      },
      queryParamsHandling: 'merge'
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
        'pagesize': page.pageSize
      },
      queryParamsHandling: 'merge'
    });
  }

  get searchText() {
    return this.form.get('searchtext');
  }

  get formPagesize() {
    return this.form.get('pagesize');
  }

  get formSearchType() {
    return this.form.get('type');
  }

  private searchObject = {
    'book': { name: 'name', id: 'isbn' },
    'genre': { name: 'name', id: 'genre_id' },
    'publisher': { name: 'name', id: 'publisher_id' },
    'author': { name: 'fullname', id: 'author_id' }
  }
}
