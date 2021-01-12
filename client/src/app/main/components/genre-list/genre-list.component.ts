import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'genre-list',
  templateUrl: './genre-list.component.html',
  styleUrls: ['./genre-list.component.scss']
})
export class GenreListComponent implements OnInit {
  displayedColumns = ['genre_id', 'name', 'bookcount'];
  dataSource: any;
  totalItems: number;
  pageSize: number;
  currentPage: number;
  private subs = new SubSink();
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
      this.subs.sink = this.dataService.getList('genre', currentPage, pageSize).subscribe(data => {
        this.dataSource = data.genres;
        this.totalItems = data.totalItem;
      });
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
