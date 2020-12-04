import { Component, Input, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'main-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
  host: {
    class: 'main-paginator'
  }
})
export class PaginatorComponent implements OnInit {
  @Input() totalItems: number;
  @Input() pageSize: number;
  @Input() pageSizeOptions: number[];
  @Input() pageIndex: number;
  @Input('pageChangeFunc') handlePageChangeFunction: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.handlePageChangeFunction = this.handlePageChange;
  }

  handlePageChange(page: PageEvent): void {
    this.router.navigate([], {
      queryParams: {
        'page': page.pageIndex,
        'pagesize': page.pageSize
      },
      queryParamsHandling: 'merge'
    })
  }

}
