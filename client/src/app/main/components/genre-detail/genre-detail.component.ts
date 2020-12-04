import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubSink } from 'subsink';
import { DataService } from '../../services/data.service';
import { scrollToTop } from '../../../shared/functions/scrollToTop';

@Component({
  selector: 'app-genre-detail',
  templateUrl: './genre-detail.component.html',
  styleUrls: ['./genre-detail.component.scss', '../author-detail/gpa-detail.scss'],
  host: {
    class: 'genre-detail'
  }
})
export class GenreDetailComponent implements OnInit {
  private subs = new SubSink();
  currentPage: number;
  pageSize: number;
  booklist: any;
  genre: any;
  totalItems: number;
  constructor(
    private dataService: DataService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.fetchGenreDetail()
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private fetchGenreDetail() {
    this.subs.sink = this.route.params.subscribe(params => {
      const currentGenreId = params['id']
      this.subs.sink = this.route.queryParams.subscribe(queryParams => {
        const pageSize = queryParams['pagesize'] || '30';
        const currentPage = queryParams['page'] || '0';
        this.currentPage = parseInt(currentPage) || 0;
        this.pageSize = parseInt(pageSize) || 30;
        
        this.subs.sink = this.dataService.getDetail('genre', currentGenreId, currentPage, pageSize)
          .subscribe(data => {
            this.booklist = data.booklist;
            this.genre = data.genre;
            this.totalItems = data.totalItems;
          });
        scrollToTop();
      });
    });
  }
}
