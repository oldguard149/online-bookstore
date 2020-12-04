import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubSink } from 'subsink';
import { DataService } from '../../services/data.service';
@Component({
  selector: 'app-publisher-detail',
  templateUrl: './publisher-detail.component.html',
  styleUrls: ['./publisher-detail.component.scss', '../author-detail/gpa-detail.scss'],
  host: {
    class: 'publisher-detail'
  }
})
export class PublisherDetailComponent implements OnInit {
  private subs = new SubSink();
  currentPage: number;
  pageSize: number;
  booklist: any;
  publisher: any;
  totalItems: number;
  constructor(
    private dataService: DataService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.fetchPublisherDetail();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private fetchPublisherDetail() {
    this.subs.sink = this.route.params.subscribe(params => {
      const currentId = params['id']
      this.subs.sink = this.route.queryParams.subscribe(queryParams => {
        const pageSize = queryParams['pagesize'] || '30';
        const currentPage = queryParams['page'] || '0';
        this.currentPage = parseInt(currentPage) || 0;
        this.pageSize = parseInt(pageSize) || 30;
        
        this.subs.sink = this.dataService.getDetail('publisher', currentId, currentPage, pageSize)
          .subscribe(data => {
            this.booklist = data.booklist;
            this.publisher = data.publisher;
            this.totalItems = data.totalItems;
          });
      });
    });
  }

}
