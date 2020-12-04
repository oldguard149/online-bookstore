import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'index-booklist',
  templateUrl: './index-booklist.component.html',
  styleUrls: ['./index-booklist.component.scss'],
  host: {
    class: 'mat-elevation-z8'
  }
})
export class IndexBooklistComponent implements OnInit {
  booklist: any;
  totalItem: number;
  pageSize: number;
  currentPage: number;
  private subscription: Subscription
  constructor(
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.subscription = this.route.queryParams.subscribe(params => {
      const currentPage = params['page'] || '0';
      const pageSize = params['pagesize'] || '30';
      this.pageSize = parseInt(pageSize);
      this.currentPage = parseInt(currentPage);
      this.dataService.getIndexBooklist(currentPage, pageSize).then(data => {
        this.booklist = data.booklist;
        this.totalItem = parseInt(data.totalItem);
      });
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  changeBooklist(page: PageEvent) {
    this.router.navigate([], {
      queryParams: {
        'page': page.pageIndex,
        'pagesize': page.pageSize
      },
      queryParamsHandling: 'merge'
    })
  }
}
