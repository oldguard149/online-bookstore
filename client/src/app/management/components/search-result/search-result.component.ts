import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { scrollToTop } from 'src/app/shared/functions/scrollToTop';

@Component({
  selector: 'search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {
  displayedColumns: string[] = ['index', 'name', 'option'];
  @Input('data') dataSource: any;
  @Input() nameKey: string;
  @Input() idKey: string;
  @Input() urlPath: string;

  // pagination
  @Input() totalItems: number;
  @Input() pageSize: number;
  @Input() pageIndex: number;
  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  handlePageChange(page: PageEvent): void {
    scrollToTop();
    this.router.navigate([], {
      queryParams: {
        'page': page.pageIndex,
        'pagesize': page.pageSize
      },
      queryParamsHandling: 'merge'
    });
  }

}
