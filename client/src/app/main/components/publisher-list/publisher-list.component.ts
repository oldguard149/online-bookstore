import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'publisher-list',
  templateUrl: './publisher-list.component.html',
  styleUrls: ['./publisher-list.component.scss', '../genre-list/genre-list.component.scss']
})
export class PublisherListComponent implements OnInit {
  private subs = new SubSink();
  displayedColumns = ['publisher_id', 'name', 'bookcount'];
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
      this.subs.sink = this.dataService.getList('publisher', currentPage, pageSize).subscribe(data => {
        this.dataSource = data.publishers;
        this.totalItems = data.totalItem;
      });
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
