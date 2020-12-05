import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IGenre } from 'src/app/shared/interfaces/interfaces';
import { ManagementService } from '../../services/management.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-genre-update',
  templateUrl: './genre-update.component.html',
  styleUrls: ['./genre-update.component.scss']
})
export class GenreUpdateComponent implements OnInit {
  errorMsg: string[];
  genre: IGenre;
  private subs = new SubSink();
  constructor(
    private route: ActivatedRoute,
    private management: ManagementService
  ) { }

  ngOnInit(): void {
    this.fetchGenreData();
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  fetchGenreData() {
    const genreId = this.route.snapshot.params['id'];
    this.subs.sink = this.management.getDetail('genre', genreId).subscribe(data => {
      if (data.success) {
        this.genre = data.genre;
      } else {
        this.errorMsg = data.message;
      }
    })
  }

  getMessage(msgObject: any) {
    const {type, message} = msgObject;
    if (type === 'fail') {
      this.errorMsg = message;
    }
  }
}
