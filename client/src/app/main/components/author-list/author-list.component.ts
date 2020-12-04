import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { SubSink } from "subsink";
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'author-list',
  templateUrl: './author-list.component.html',
  styleUrls: ['./author-list.component.scss', '../genre-list/genre-list.component.scss']
})
export class AuthorListComponent implements OnInit {
  private subs = new SubSink();
  displayedColumns = ['author_id', 'fullname', 'bookcount'];
  dataSource: any;
  totalItems: number;
  pageSize: number;
  currentPage: number;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.subs.sink = this.route.queryParams.subscribe(params => {
      const currentPage = params['page'] || '0';
      const pageSize = params['pagesize'] || '10';
      this.pageSize = parseInt(pageSize);
      this.currentPage = parseInt(currentPage);
      this.subs.sink = this.dataService.getList('author', currentPage, pageSize)
        .subscribe(data => {
          this.dataSource = data.authors;
          this.totalItems = data.totalItem;
        });
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
