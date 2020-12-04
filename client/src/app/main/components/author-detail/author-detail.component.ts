import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { SubSink } from 'subsink';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-author-detail',
  templateUrl: './author-detail.component.html',
  styleUrls: ['./author-detail.component.scss', './gpa-detail.scss'],
  host: {
    class: 'author-detail'
  }
})
export class AuthorDetailComponent implements OnInit {
  private subs = new SubSink();
  currentPage: number;
  pageSize: number;
  booklist: any;
  author: any;
  totalItems: number;
  constructor(
    private dataService: DataService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.fetchAuthorDetail();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private fetchAuthorDetail() {
    this.subs.sink = this.route.params.subscribe(params => {
      const currentAuthorId = params['id']
      this.subs.sink = this.route.queryParams.subscribe(queryParams => {
        const pageSize = queryParams['pagesize'] || '30';
        const currentPage = queryParams['page'] || '0';
        this.currentPage = parseInt(currentPage) || 0;
        this.pageSize = parseInt(pageSize) || 30;
        
        this.subs.sink = this.dataService.getDetail('author', currentAuthorId, currentPage, pageSize)
          .subscribe(data => {
            this.booklist = data.booklist;
            this.author = data.author;
            this.totalItems = data.totalItems;
          });
      });
    });
  }

}
