import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { scrollToTop } from 'src/app/shared/functions/scrollToTop';
import { SubSink } from 'subsink';
import { RequestToApiService } from '../../services/request-to-api.service';

@Component({
  selector: 'management-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss']
})
export class SearchFormComponent implements OnInit {
  private subs = new SubSink();
  errorMsg: string[];
  form: FormGroup;
  totalItems: number;
  currentPage: number;
  pageSize: number;
  dataKey: string;
  @Input() objectType: 'genre' | 'publisher' | 'author' | 'book';
  @Output() sendSearchData: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private requestToApi: RequestToApiService
  ) { }

  ngOnInit(): void {
    this.dataKey = `${this.objectType}s`;
    this.form = this.fb.group({
      searchText: ['', Validators.required],
      pageSize: [10, Validators.required]
    });
    this.fetchSearchResult();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onSubmit() {
    this.router.navigate([], {
      queryParams: {
        'search': this.formSearchText.value.replace(/ /gi, '+'),
        'pageSize': this.formPageSize.value,
        'page': 0
      },
      queryParamsHandling: 'merge'
    });
  }

  fetchSearchResult() {
    this.subs.sink = this.route.queryParams.subscribe(params => {      
      const rawSearchText = params['search'];
      const currentPage = params['page'];
      const pageSize = params['pageSize']
      if (rawSearchText !== undefined) {
        !isNaN(pageSize) ? this.pageSize = parseInt(pageSize) : this.pageSize = 10;
        !isNaN(currentPage) ? this.currentPage = parseInt(currentPage) : this.currentPage = 0;

        if (this.form !== undefined) {
          this.formSearchText.setValue(rawSearchText.replace(/\+/gi, ' '));
          this.formPageSize.setValue(this.pageSize);
        }
        const searchText = rawSearchText.replace(/ /gi, '+');

        this.subs.sink = this.requestToApi.search(this.objectType, searchText, currentPage, pageSize)
          .subscribe(data => {
            if (data.success) {
              this.triggerSendData(data[this.dataKey], this.currentPage, data.totalItems, this.pageSize);
            } else {
              this.errorMsg = data.message;
            }
          });
      }
      scrollToTop();
    });
  }

  triggerSendData(resultData: any, pageIndex: number, totalItems: number, pageSize: number) {
    const data = { data: resultData, pageIndex, totalItems, pageSize }
    this.sendSearchData.emit(data);
  }

  get formSearchText() { return this.form.get('searchText'); }
  get formPageSize() { return this.form.get('pageSize'); }
}
